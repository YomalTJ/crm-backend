import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private config: ConfigService,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token =
      this.extractTokenFromHeader(request) ||
      this.extractTokenFromCookies(request);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const isValid = await this.authService.isTokenValid(token);
      if (!isValid) {
        throw new UnauthorizedException('Token is invalid or expired');
      }

      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.config.get('JWT_SECRET'),
      });

      request['user'] = {
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

      return true;
    } catch (err) {
      if (err instanceof UnauthorizedException) {
        throw err;
      }
      throw new UnauthorizedException('Invalid token');
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private extractTokenFromCookies(request: any): string | undefined {
    return (
      request.cookies?.['accessToken'] ||
      request.cookies?.['staffAccessToken'] ||
      request.cookies?.['access_token'] ||
      request.cookies?.['staff_access_token']
    );
  }
}
