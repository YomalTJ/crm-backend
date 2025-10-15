import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateGrantUtilizationDto } from './dto/create-grant-utilization.dto';
import { GrantUtilizationService } from './grant-utilization.service';
import { UpdateGrantUtilizationDto } from './dto/update-grant-utilization.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('grant-utilization')
export class GrantUtilizationController {
  constructor(
    private readonly grantUtilizationService: GrantUtilizationService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  create(
    @Body() createGrantUtilizationDto: CreateGrantUtilizationDto,
    @Req() req: Request,
  ) {
    const staffId = req['user'].userId;
    return this.grantUtilizationService.create(
      createGrantUtilizationDto,
      staffId,
    );
  }

  @Put(':hhNumberOrNic')
  @UseGuards(AuthGuard)
  updateByHhNumberOrNic(
    @Param('hhNumberOrNic') hhNumberOrNic: string,
    @Body() updateGrantUtilizationDto: UpdateGrantUtilizationDto,
    @Req() req: Request,
  ) {
    const staffId = req['user'].userId;
    return this.grantUtilizationService.updateByHhNumberOrNic(
      hhNumberOrNic,
      updateGrantUtilizationDto,
      staffId,
    );
  }

  @Get('family/:hhNumberOrNic')
  async findByHhNumberOrNicWithFamily(
    @Param('hhNumberOrNic') hhNumberOrNic: string,
  ) {
    return this.grantUtilizationService.findByHhNumberOrNicWithFamily(
      hhNumberOrNic,
    );
  }
}
