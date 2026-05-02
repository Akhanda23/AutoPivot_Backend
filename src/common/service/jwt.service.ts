import { UnauthorizedException } from '@nestjs/common';
import jwt, { SignOptions } from 'jsonwebtoken';

export class JwtService {
  private secretKey: string;

  constructor() {
    this.secretKey = process.env.JWT_SECRET!;
  }

  sign(payload: object, options?: SignOptions): string {
    return jwt.sign(payload, this.secretKey, options);
  }

  jwtLoginVerify(token: string, secret: string) {
    try {
      return jwt.verify(token, secret);
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedException('Token has expired');
      } else if (err instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedException('Invalid Jwt token');
      }
      throw err;
    }
  }
}
