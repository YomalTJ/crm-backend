import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountType } from './entities/account-type.entity';
import { CreateAccountTypeDto } from './dto/create-account-type.dto';
import { UpdateAccountTypeDto } from './dto/update-account-type.dto';

@Injectable()
export class AccountTypesService {
  constructor(
    @InjectRepository(AccountType)
    private readonly accountTypeRepository: Repository<AccountType>,
  ) {}

  async create(
    createAccountTypeDto: CreateAccountTypeDto,
  ): Promise<AccountType> {
    const accountType = this.accountTypeRepository.create(createAccountTypeDto);
    return await this.accountTypeRepository.save(accountType);
  }

  async findAll(): Promise<AccountType[]> {
    return await this.accountTypeRepository.find({
      order: { samurdhi_bank_account_type_id: 'ASC' },
    });
  }

  async findOne(samurdhi_bank_account_type_id: number): Promise<AccountType> {
    const accountType = await this.accountTypeRepository.findOne({
      where: { samurdhi_bank_account_type_id },
    });
    if (!accountType) {
      throw new NotFoundException(`Account type with ID ${samurdhi_bank_account_type_id} not found`);
    }
    return accountType;
  }

  async update(
    id: number,
    updateAccountTypeDto: UpdateAccountTypeDto,
  ): Promise<AccountType> {
    const accountType = await this.findOne(id);
    Object.assign(accountType, updateAccountTypeDto);
    return await this.accountTypeRepository.save(accountType);
  }

  async remove(id: number): Promise<void> {
    const accountType = await this.findOne(id);
    await this.accountTypeRepository.remove(accountType);
  }

  async seedInitialData(): Promise<void> {
    const initialData = ['Saving', 'Diriya Matha', 'Kekulu Lama'];

    for (const name of initialData) {
      const exists = await this.accountTypeRepository.findOne({
        where: { name },
      });
      if (!exists) {
        await this.accountTypeRepository.save({ name });
      }
    }
  }
}
