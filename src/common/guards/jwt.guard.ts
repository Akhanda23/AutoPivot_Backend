import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { UserI } from '../interfaces/global.interface';
import { JwtService } from '../service/jwt.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user: UserI }>();

    const tokenFromCookie = <string>request.cookies?.token;

    // Optional: fallback to Authorization header
    const authorization = request.header('authorization');
    const tokenFromHeader = <string>authorization?.split(' ')[1];

    const accessToken: string = tokenFromCookie || tokenFromHeader;

    if (!accessToken) {
      throw new UnauthorizedException('Unauthorized');
    }
    const payload = <UserI>(
      this.jwtService.jwtLoginVerify(accessToken, process.env.JWT_SECRET!)
    );

    delete payload['iat'];
    delete payload['exp'];

    request.user = payload;

    return true;
  }
}
