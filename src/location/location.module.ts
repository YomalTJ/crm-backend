import { Module } from '@nestjs/common';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Province } from './entities/province.entity';
import { District } from './entities/district.entity';
import { Ds } from './entities/ds.entity';
import { Zone } from './entities/zone.entity';
import { Gnd } from './entities/gnd.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Province, District, Ds, Zone, Gnd])],
  controllers: [LocationController],
  providers: [LocationService],
})
export class LocationModule {}
