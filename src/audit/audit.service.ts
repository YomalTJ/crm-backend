import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuditService {
  findAll(arg0: { page: number; limit: number; }): [any, any] | PromiseLike<[any, any]> {
      throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(AuditLog)
    private auditRepo: Repository<AuditLog>,
  ) {}

  async log(
    action: 'CREATE' | 'UPDATE' | 'DELETE',
    entityName: string,
    entityId: string,
    performedBy: string,
    oldData: any,
    newData: any,
  ) {
    const oldDataString = oldData ? JSON.stringify(oldData) : null;
    const newDataString = newData ? JSON.stringify(newData) : null;

    const log = this.auditRepo.create({
      action,
      entityName,
      entityId,
      performedBy,
      oldData: oldDataString,
      newData: newDataString,
    });
    await this.auditRepo.save(log);
  }
}
