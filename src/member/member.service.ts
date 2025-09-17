import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import { Repository } from 'typeorm';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import * as bcrypt from 'bcrypt';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginMemberDto } from './dto/login-member.dto';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private memberRepo: Repository<Member>,
    private jwtService: JwtService,
  ) {}

  async create(dto: CreateMemberDto, userId: string) {
    let memberData: any = {
      ...dto,
      addedBy: { id: userId },
    };

    if (dto.password) {
      memberData.password = await bcrypt.hash(dto.password, 10);
    }

    const member = this.memberRepo.create(memberData);
    return this.memberRepo.save(member);
  }

  findAll(userId: string) {
    return this.memberRepo.find({ where: { addedBy: { id: userId } } });
  }

  async findOne(id: string, userId: string) {
    const participant = await this.memberRepo.findOne({
      where: { id, addedBy: { id: userId } },
    });
    if (!participant) throw new NotFoundException('Participant not found');
    return participant;
  }

  async update(id: string, dto: UpdateMemberDto, userId: string) {
    const participant = await this.findOne(id, userId);
    Object.assign(participant, dto);
    return this.memberRepo.save(participant);
  }

  async remove(id: string, userId: string) {
    const participant = await this.findOne(id, userId);
    return this.memberRepo.remove(participant);
  }

  async updatePassword(id: string, userId: string, dto: UpdatePasswordDto) {
    const member = await this.findOne(id, userId);
    const hashed = await bcrypt.hash(dto.newPassword, 10);
    member.password = hashed;
    return this.memberRepo.save(member);
  }

  async login(dto: LoginMemberDto) {
    const member = await this.memberRepo.findOne({
      where: { username: dto.username },
    });

    if (!member || !member.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const ismatch = await bcrypt.compare(dto.password, member.password);
    if (!ismatch) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwtService.sign({ sub: member.id, role: 'member' });

    return {
      message: 'Login successful',
      access_token: token,
    };
  }
}
