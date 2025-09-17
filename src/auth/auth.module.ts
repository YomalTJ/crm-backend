import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BlacklistedToken } from './entities/blacklisted-token.entity';
import { AuthGuard } from './guards/auth.guard';
import { TokenCleanupService } from 'src/utils/token-cleanup.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, BlacklistedToken]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (cfg: ConfigService) => ({
        secret: cfg.get('JWT_SECRET'),
        signOptions: { expiresIn: cfg.get('JWT_EXPIRES_IN', '1d') },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, TokenCleanupService],
  exports: [JwtModule, AuthService, AuthGuard],
})
export class AuthModule {}
