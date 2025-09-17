import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { BlacklistedToken } from './entities/blacklisted-token.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(BlacklistedToken)
    private blacklistRepo: Repository<BlacklistedToken>,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.userRepo.findOne({
      where: { username: dto.username },
    });
    if (existing) throw new BadRequestException('Username already exists');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.userRepo.create({
      username: dto.username,
      password: hashedPassword,
      language: dto.language,
    });

    await this.userRepo.save(user);

    return { message: 'Registration succesful' };
  }

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({
      where: { username: dto.username },
      select: ['id', 'username', 'password'],
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isValidPassword = await bcrypt.compare(dto.password, user.password);
    if (!isValidPassword)
      throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, username: user.username, role: 'user' };
    const token = await this.jwtService.signAsync(payload, {
      secret: this.config.get('JWT_SECRET'),
      expiresIn: this.config.get('JWT_EXPIRES_IN', '7d'),
    });

    const decoded = this.jwtService.decode(token) as { exp: number };
    const expiresAt = new Date(decoded.exp * 1000);

    await this.blacklistRepo.save({
      token,
      expiresAt,
      userId: user.id,
      isValid: true,
    });

    return {
      accessToken: token,
    };
  }

  async logout(token: string): Promise<void> {
    try {
      const result = await this.blacklistRepo.update(
        { token },
        { isValid: false },
      );

      if (result.affected === 0) {
        this.logger.warn(`Token not found during logout: ${token}`);
      } else {
        this.logger.log(`Successfully invalidated token: ${token}`);
      }
    } catch (error) {
      this.logger.error(`Error invalidating token: ${token}`, error.stack);
    }
  }

  async isTokenValid(token: string): Promise<boolean> {
    try {
      const tokenRecord = await this.blacklistRepo.findOne({
        where: { token },
      });

      if (!tokenRecord) {
        this.logger.warn(`Token not found in database: ${token}`);
        return false;
      }

      if (tokenRecord.expiresAt < new Date()) {
        this.logger.log(`Token expired: ${token}`);
        await this.blacklistRepo.delete({ token });
        return false;
      }

      if (!tokenRecord.isValid) {
        this.logger.log(`Token marked as invalid: ${token}`);
        return false;
      }

      return true;
    } catch (error) {
      this.logger.error(`Error checking token validity: ${token}`, error.stack);
      return false;
    }
  }

  async getActiveTokensForUser(userId: string): Promise<BlacklistedToken[]> {
    return this.blacklistRepo.find({
      where: {
        userId,
        isValid: true,
        expiresAt: new Date(), // Not expired yet
      },
    });
  }
}
