import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LivelihoodsService } from './livelihoods.service';
import { LivelihoodsController } from './livelihoods.controller';
import { Livelihood } from './entities/livelihood.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Livelihood])],
  controllers: [LivelihoodsController],
  providers: [LivelihoodsService],
})
export class LivelihoodsModule {}
