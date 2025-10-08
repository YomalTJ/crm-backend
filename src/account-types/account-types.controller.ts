import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { AccountTypesService } from './account-types.service';
import { CreateAccountTypeDto } from './dto/create-account-type.dto';
import { UpdateAccountTypeDto } from './dto/update-account-type.dto';
import { AccountType } from './entities/account-type.entity';

@Controller('account-types')
export class AccountTypesController {
  constructor(private readonly accountTypesService: AccountTypesService) {}

  @Post()
  create(
    @Body() createAccountTypeDto: CreateAccountTypeDto,
  ): Promise<AccountType> {
    return this.accountTypesService.create(createAccountTypeDto);
  }

  @Get()
  findAll(): Promise<AccountType[]> {
    return this.accountTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<AccountType> {
    return this.accountTypesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAccountTypeDto: UpdateAccountTypeDto,
  ): Promise<AccountType> {
    return this.accountTypesService.update(id, updateAccountTypeDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.accountTypesService.remove(id);
  }
}
