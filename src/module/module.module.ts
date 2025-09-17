import { Module } from '@nestjs/common';
import { ModuleController } from './module.controller';
import { ModuleService } from './module.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemModules } from './entities/module.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SystemModules])],
  controllers: [ModuleController],
  providers: [ModuleService],
})
export class ModuleModule {}
