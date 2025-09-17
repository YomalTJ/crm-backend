import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const appKey = req.headers['x-app-key'] as string;
    const expectedKey = this.config.get<string>('APP_AUTH_KEY');

    if (!appKey || appKey !== expectedKey) {
      throw new UnauthorizedException('Invalid Application Key');
    }

    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer '))
      throw new UnauthorizedException('Missing Bearer token');

    const token = authHeader.split(' ')[1];
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.config.get<string>('JWT_SECRET'),
      });

      req['user'] = {
        userId: payload.sub,
        username: payload.username,
        locationCode: payload.locationCode,
        role: {
          id: payload.roleId,
          name: payload.roleName,
          canAdd: payload.roleCanAdd,
          canUpdate: payload.roleCanUpdate,
          canDelete: payload.roleCanDelete,
        },
      };

      next();
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
