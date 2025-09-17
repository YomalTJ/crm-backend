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
import { Repository } from 'typeorm';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { UserRole } from 'src/user-role/entities/user-role.entity';
import { StaffLoginDto } from './dto/staff-login.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { BlacklistedToken } from 'src/auth/entities/blacklisted-token.entity';

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

    const existing = await this.staffRepo.findOne({
      where: { username: dto.username },
    });
    if (existing) throw new BadRequestException('Username already exists');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const staff = this.staffRepo.create({
      ...dto,
      password: hashedPassword,
      role: { id: dto.userRoleId },
      addedBy: { id: userId } as Staff,
    });

    return this.staffRepo.save(staff);
  }

  async findAll(userId: string) {
    return this.staffRepo.find({
      where: { addedBy: { id: userId } },
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
    if (dto.userRoleId) {
      const role = await this.roleRepo.findOneBy({ id: dto.userRoleId });
      if (!role) throw new NotFoundException('User role not found');
      staff.role = role;
    }
    Object.assign(staff, dto);
    return this.staffRepo.save(staff);
  }

  async remove(id: string, userId: string) {
    const staff = await this.findOne(id, userId);
    return this.staffRepo.remove(staff);
  }

  async staffLogin(dto: StaffLoginDto) {
    const staffUser = await this.staffRepo.findOne({
      where: { username: dto.username },
      select: ['id', 'name', 'username', 'password', 'locationCode', 'role'],
      relations: ['role'],
    });

    if (!staffUser) throw new UnauthorizedException('Invalid credentials');

    const isValidPassword = await bcrypt.compare(
      dto.password,
      staffUser.password,
    );
    if (!isValidPassword)
      throw new UnauthorizedException('Invalid credentials');

    // Initialize empty location details
    const locationDetails: any = {
      province: null,
      district: null,
      dsDivision: null,
      zone: null,
      gnd: null,
    };

    // Only parse location if it exists
    if (staffUser.locationCode) {
      const locationParts = staffUser.locationCode.split('-');

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
    }

    // Include locationCode in the JWT payload
    const payload = {
      sub: staffUser.id,
      name: staffUser.name,
      username: staffUser.username,
      locationCode: staffUser.locationCode,
      roleId: staffUser.role.id,
      roleName: staffUser.role.name,
      roleCanAdd: staffUser.role.canAdd,
      roleCanUpdate: staffUser.role.canUpdate,
      roleCanDelete: staffUser.role.canDelete,
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
      userId: staffUser.id,
      isValid: true,
    });

    return {
      staffAccessToken: token,
      locationDetails,
    };
  }
}
