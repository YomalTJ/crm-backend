import { Module } from '@nestjs/common';
import { UserRoleController } from './user-role.controller';
import { UserRoleService } from './user-role.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRole } from './entities/user-role.entity';
import { SystemModules } from 'src/module/entities/module.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserRole, SystemModules])],
  controllers: [UserRoleController],
  providers: [UserRoleService],
})
export class UserRoleModule {}
