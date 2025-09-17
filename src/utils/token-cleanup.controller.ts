import { Controller, Post, UseGuards } from '@nestjs/common';
import { TokenCleanupService } from './token-cleanup.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@ApiTags('System Maintenance')
@Controller('system/tokens')
export class TokenCleanupController {
  constructor(private readonly tokenCleanupService: TokenCleanupService) {}

  @Post('cleanup')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Manually trigger token cleanup' })
  @ApiResponse({ status: 200, description: 'Cleanup completed successfully' })
  async manualCleanup() {
    const count = await this.tokenCleanupService.cleanExpiredTokens();
    return { message: `Cleaned up ${count} tokens` };
  }
}
