import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlacklistedToken } from '../auth/entities/blacklisted-token.entity';
import { TokenCleanupService } from './token-cleanup.service';

@Module({
  imports: [TypeOrmModule.forFeature([BlacklistedToken])],
  providers: [TokenCleanupService],
  exports: [TokenCleanupService],
})
export class TokenCleanupModule {}
