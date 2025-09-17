import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppKeyMiddleware implements NestMiddleware {
  constructor(private config: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const appKey = req.headers['x-app-key'] as string;
    const expectedKey = this.config.get<string>('APP_AUTH_KEY');

    if (!appKey || appKey !== expectedKey) {
      throw new UnauthorizedException('Invalid Application Key');
    }

    next();
  }
}
