import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BlacklistedToken } from '../auth/entities/blacklisted-token.entity';

@Injectable()
export class TokenCleanupService implements OnModuleInit {
  private readonly logger = new Logger(TokenCleanupService.name);

  constructor(
    @InjectRepository(BlacklistedToken)
    private blacklistRepo: Repository<BlacklistedToken>,
  ) {}

  async onModuleInit() {
    this.logger.log('Initializing token cleanup service...');
    await this.cleanExpiredTokens();
  }

  @Cron(CronExpression.EVERY_DAY_AT_3AM) // Runs daily at 3 AM
  async handleDailyCleanup() {
    this.logger.log('Running scheduled token cleanup...');
    await this.cleanExpiredTokens();
  }

  @Cron('0 */6 * * *') // Runs every 6 hours
  async handleFrequentCleanup() {
    this.logger.log('Running frequent token cleanup check...');
    await this.cleanExpiredTokens();
  }

  async cleanExpiredTokens(): Promise<number> {
    try {
      const result = await this.blacklistRepo
        .createQueryBuilder()
        .delete()
        .where('expiresAt < :now', { now: new Date() })
        .orWhere('isValid = :isValid', { isValid: false })
        .execute();

      this.logger.log(`Cleaned up ${result.affected} expired/invalid tokens`);
      return result.affected || 0;
    } catch (error) {
      this.logger.error('Error cleaning expired tokens:', error);
      throw error;
    }
  }

  async cleanAllInvalidTokens(): Promise<number> {
    try {
      const result = await this.blacklistRepo
        .createQueryBuilder()
        .delete()
        .where('isValid = :isValid', { isValid: false })
        .execute();

      this.logger.log(`Cleaned up ${result.affected} invalid tokens`);
      return result.affected || 0;
    } catch (error) {
      this.logger.error('Error cleaning invalid tokens:', error);
      throw error;
    }
  }
}
