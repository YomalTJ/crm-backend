// staff.service.ts
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Staff } from './entities/staff.entity';
import { Like, Not, Repository } from 'typeorm';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { UserRole } from 'src/user-role/entities/user-role.entity';
import { StaffLoginDto } from './dto/staff-login.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { BlacklistedToken } from 'src/auth/entities/blacklisted-token.entity';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private staffRepo: Repository<Staff>,
    @InjectRepository(UserRole)
    private roleRepo: Repository<UserRole>,
    private jwtService: JwtService,
    private config: ConfigService,
    @InjectRepository(BlacklistedToken)
    private blacklistRepo: Repository<BlacklistedToken>,
  ) {}

  async create(dto: CreateStaffDto, userId: string) {
    const creatingUser = await this.staffRepo.findOne({
      where: { id: userId },
      relations: ['role'],
    });

    if (!creatingUser || creatingUser.role.name !== 'National Level User') {
      throw new ForbiddenException(
        'Only National Level Users can create staff members',
      );
    }

    // Check if username already exists (globally unique)
    if (dto.username) {
      const existingUsername = await this.staffRepo.findOne({
        where: { username: dto.username },
      });

      if (existingUsername) {
        throw new BadRequestException('Username already exists');
      }
    }

    // For national level users, username is required
    const role = await this.roleRepo.findOneBy({ id: dto.userRoleId });
    if (!role) throw new NotFoundException('User role not found');

    if (role.name === 'National Level User' && !dto.username) {
      throw new BadRequestException(
        'Username is required for National Level Users',
      );
    }

    // Hash the regular password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Store WBB password as plain text
    const wbbPassword = dto.wbbPassword || null;

    const staff = this.staffRepo.create({
      name: dto.name,
      nic: dto.nic,
      username: dto.username,
      language: dto.language,
      password: hashedPassword,
      wbbPassword: wbbPassword,
      locationCode: dto.locationCode,
      role: { id: dto.userRoleId },
      addedBy: { id: userId } as Staff,
    });

    try {
      return await this.staffRepo.save(staff);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('Username already exists');
      }
      throw error;
    }
  }

  async createMultiple(dtos: CreateStaffDto[], userId: string) {
    const creatingUser = await this.staffRepo.findOne({
      where: { id: userId },
      relations: ['role'],
    });

    if (!creatingUser || creatingUser.role.name !== 'National Level User') {
      throw new ForbiddenException(
        'Only National Level Users can create staff members',
      );
    }

    // Define proper type for results
    const results: Array<Staff | { error: string; dto: CreateStaffDto }> = [];

    for (const dto of dtos) {
      try {
        // Check if username is provided for national level users
        const role = await this.roleRepo.findOneBy({ id: dto.userRoleId });
        if (!role) {
          throw new NotFoundException(
            `User role not found for ID: ${dto.userRoleId}`,
          );
        }

        if (role.name === 'National Level User' && !dto.username) {
          throw new BadRequestException(
            'Username is required for National Level Users',
          );
        }

        // Generate username for non-national users if not provided
        let finalUsername = dto.username;
        if (role.name !== 'National Level User' && dto.locationCode) {
          finalUsername = dto.locationCode.replace(/-/g, '');
        }

        // Check if username already exists (globally unique)
        if (finalUsername) {
          const existing = await this.staffRepo.findOne({
            where: { username: finalUsername },
          });

          if (existing) {
            throw new BadRequestException(
              `Username ${finalUsername} already exists`,
            );
          }
        }

        // Hash the regular password
        const hashedPassword = await bcrypt.hash(dto.password, 10);

        // Store WBB password as plain text (or encrypt it, but DON'T hash it)
        const wbbPassword = dto.wbbPassword || null;

        const staff = this.staffRepo.create({
          name: dto.name,
          nic: dto.nic,
          username: finalUsername,
          language: dto.language,
          password: hashedPassword,
          wbbPassword: wbbPassword,
          locationCode: dto.locationCode,
          role: { id: dto.userRoleId },
          addedBy: { id: userId } as Staff,
        });

        const savedStaff = await this.staffRepo.save(staff);
        results.push(savedStaff);
      } catch (error) {
        results.push({
          error: error.message,
          dto: {
            ...dto,
            password: '***', // Hide password in error response
            wbbPassword: dto.wbbPassword ? '***' : undefined,
          },
        });
      }
    }

    return results;
  }

  async findAll(userId: string) {
    return this.staffRepo.find({
      where: { addedBy: { id: userId } },
      relations: ['role'],
    });
  }

  // New method to find all staff records for a specific username
  async findByUsername(username: string, userId: string) {
    return this.staffRepo.find({
      where: {
        username,
        addedBy: { id: userId },
      },
      relations: ['role'],
    });
  }

  async findOne(id: string, userId: string) {
    const staff = await this.staffRepo.findOne({
      where: { id, addedBy: { id: userId } },
      relations: ['role'],
    });
    if (!staff) throw new NotFoundException('Staff not found');
    return staff;
  }

  async update(id: string, dto: UpdateStaffDto, userId: string) {
    const staff = await this.findOne(id, userId);

    // If updating username or locationCode, check for duplicates
    if (dto.username || dto.locationCode) {
      const whereCondition: any = {
        username: dto.username || staff.username,
        locationCode: dto.locationCode || staff.locationCode,
      };

      // Add condition to exclude current record using Not operator
      whereCondition.id = Not(id);

      const existing = await this.staffRepo.findOne({
        where: whereCondition,
      });

      if (existing) {
        throw new BadRequestException(
          'Staff member with this username already exists for the specified location',
        );
      }
    }

    if (dto.userRoleId) {
      const role = await this.roleRepo.findOneBy({ id: dto.userRoleId });
      if (!role) throw new NotFoundException('User role not found');
      staff.role = role;
    }

    if (dto.wbbPassword) {
      staff.wbbPassword = await bcrypt.hash(dto.wbbPassword, 10);
    }

    Object.assign(staff, dto);
    return this.staffRepo.save(staff);
  }

  async remove(id: string, userId: string) {
    const staff = await this.findOne(id, userId);
    return this.staffRepo.remove(staff);
  }

  // New method to remove all staff records for a specific username
  async removeByUsername(username: string, userId: string) {
    const staffMembers = await this.findByUsername(username, userId);
    const removedStaff = await this.staffRepo.remove(staffMembers);
    return removedStaff;
  }

  async staffLogin(dto: StaffLoginDto) {
    // Find all staff records with this username
    const staffUsers = await this.staffRepo.find({
      where: { username: dto.username },
      relations: ['role'],
      select: [
        'id',
        'name',
        'nic',
        'username',
        'password',
        'wbbPassword',
        'locationCode',
        'role',
      ],
    });

    if (!staffUsers.length) {
      throw new UnauthorizedException('Invalid credentials');
    }

    let authenticatedUser: Staff | null = null;

    // ONLY check regular password for authentication
    for (const user of staffUsers) {
      const isValidPassword = await bcrypt.compare(dto.password, user.password);
      if (isValidPassword) {
        authenticatedUser = user;
        break;
      }
    }

    if (!authenticatedUser) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Get all location codes for this username
    const allUserLocations = staffUsers.map((user) => user.locationCode);

    // Initialize location details for the authenticated location
    const locationDetails: any = await this.getLocationDetails(
      authenticatedUser.locationCode,
    );

    // Include all location codes and the specific authenticated location in the JWT payload
    const payload = {
      sub: authenticatedUser.id,
      name: authenticatedUser.name,
      nic: authenticatedUser.nic,
      username: authenticatedUser.username,
      locationCode: authenticatedUser.locationCode,
      allLocationCodes: allUserLocations,
      roleId: authenticatedUser.role.id,
      roleName: authenticatedUser.role.name,
      roleCanAdd: authenticatedUser.role.canAdd,
      roleCanUpdate: authenticatedUser.role.canUpdate,
      roleCanDelete: authenticatedUser.role.canDelete,
      // Remove usedWbbPassword from JWT since WBB password cannot be used for login
    };

    const token = await this.jwtService.signAsync(payload, {
      secret: this.config.get('JWT_SECRET'),
      expiresIn: this.config.get('JWT_EXPIRES_IN', '7d'),
    });

    const decoded = this.jwtService.decode(token) as { exp: number };
    const expiresAt = new Date(decoded.exp * 1000);

    await this.blacklistRepo.save({
      token,
      expiresAt,
      userId: authenticatedUser.id,
      isValid: true,
    });

    return {
      staffAccessToken: token,
      locationDetails,
      availableLocations: allUserLocations,
      // Return the stored WBB password hash (for reference, not for login)
      wbbPassword: authenticatedUser.wbbPassword || null,
      nic: authenticatedUser.nic,
    };
  }

  // Extract location details logic to a separate method
  private async getLocationDetails(locationCode: string | null) {
    const locationDetails: any = {
      province: null,
      district: null,
      dsDivision: null,
      zone: null,
      gnd: null,
    };

    if (!locationCode) return locationDetails;

    const locationParts = locationCode.split('-');

    // Build hierarchical location codes
    let provinceCode = '';
    let districtCode = '';
    let dsCode = '';
    let zoneCode = '';
    let gndCode = '';

    if (locationParts.length >= 1) provinceCode = locationParts[0];
    if (locationParts.length >= 2)
      districtCode = `${locationParts[0]}-${locationParts[1]}`;
    if (locationParts.length >= 3)
      dsCode = `${locationParts[0]}-${locationParts[1]}-${locationParts[2]}`;
    if (locationParts.length >= 4)
      zoneCode = `${locationParts[0]}-${locationParts[1]}-${locationParts[2]}-${locationParts[3]}`;
    if (locationParts.length >= 5)
      gndCode = `${locationParts[0]}-${locationParts[1]}-${locationParts[2]}-${locationParts[3]}-${locationParts[4]}`;

    // Query each level using the complete hierarchical code
    if (provinceCode) {
      const [province] = await this.staffRepo.query(
        `SELECT id, province_id, province_name as name FROM provinces WHERE id = ?`,
        [provinceCode],
      );
      locationDetails.province = province
        ? {
            id: province.id,
            provinceId: province.province_id,
            name: province.name,
          }
        : null;
    }

    if (districtCode) {
      const [district] = await this.staffRepo.query(
        `SELECT id, district_id, district_name as name FROM districts WHERE id = ?`,
        [districtCode],
      );
      locationDetails.district = district
        ? {
            id: district.id,
            districtId: district.district_id,
            name: district.name,
          }
        : null;
    }

    if (dsCode) {
      const [dsDivision] = await this.staffRepo.query(
        `SELECT id, ds_id, ds_name as name FROM ds WHERE id = ?`,
        [dsCode],
      );
      locationDetails.dsDivision = dsDivision
        ? {
            id: dsDivision.id,
            dsId: dsDivision.ds_id,
            name: dsDivision.name,
          }
        : null;
    }

    if (zoneCode) {
      const [zone] = await this.staffRepo.query(
        `SELECT id, zone_id, zone_name as name FROM zone WHERE id = ?`,
        [zoneCode],
      );
      locationDetails.zone = zone
        ? {
            id: zone.id,
            zoneId: zone.zone_id,
            name: zone.name,
          }
        : null;
    }

    if (gndCode) {
      const [gnd] = await this.staffRepo.query(
        `SELECT id, gnd_id, gnd_name as name FROM gnd WHERE id = ?`,
        [gndCode],
      );
      locationDetails.gnd = gnd
        ? {
            id: gnd.id,
            gndId: gnd.gnd_id,
            name: gnd.name,
          }
        : null;
    }

    return locationDetails;
  }

  async changePassword(id: string, dto: ChangePasswordDto, userId: string) {
    // Get the district level user who is making the request
    const districtLevelUser = await this.staffRepo.findOne({
      where: { id: userId },
      relations: ['role'],
    });

    if (
      !districtLevelUser ||
      districtLevelUser.role.name !== 'District Level User'
    ) {
      throw new ForbiddenException(
        'Only District Level Users can change passwords',
      );
    }

    // Find the target user by ID (primary key) - Changed from NIC
    const targetUser = await this.staffRepo.findOne({
      where: { id }, // Changed from { nic } to { id }
      relations: ['role'],
    });

    if (!targetUser) {
      throw new NotFoundException('User not found with the provided ID'); // Updated message
    }

    // Check if target user is within the district level user's jurisdiction
    const canChangePassword = await this.canChangePasswordForUser(
      districtLevelUser,
      targetUser,
    );

    if (!canChangePassword) {
      throw new ForbiddenException(
        'You can only change passwords for users in your district jurisdiction',
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Update the password
    targetUser.password = hashedPassword;

    try {
      await this.staffRepo.save(targetUser);
      return {
        message: 'Password changed successfully',
        user: {
          id: targetUser.id, // Include ID in response
          name: targetUser.name,
          nic: targetUser.nic,
          role: targetUser.role.name,
          locationCode: targetUser.locationCode,
        },
      };
    } catch (error) {
      throw new BadRequestException('Failed to change password');
    }
  }

  private async canChangePasswordForUser(
    districtLevelUser: Staff,
    targetUser: Staff,
  ): Promise<boolean> {
    const allowedRoles = [
      'District Level User',
      'Divisional Level User',
      'Bank/Zone Level User',
      'GN Level User',
    ];

    // Check if target user role is allowed
    if (!allowedRoles.includes(targetUser.role.name)) {
      return false;
    }

    // Extract district code from location codes
    const districtUserDistrictCode = this.extractDistrictCode(
      districtLevelUser.locationCode,
    );
    const targetUserDistrictCode = this.extractDistrictCode(
      targetUser.locationCode,
    );

    // Check if both users belong to the same district
    return districtUserDistrictCode === targetUserDistrictCode;
  }

  private extractDistrictCode(locationCode: string | null): string | null {
    if (!locationCode) return null;

    const parts = locationCode.split('-');
    // District code is first two parts (e.g., "1-1" from "1-1-1")
    return parts.length >= 2 ? `${parts[0]}-${parts[1]}` : null;
  }
}
