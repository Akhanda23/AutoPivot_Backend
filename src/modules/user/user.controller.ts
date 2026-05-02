import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, LoginUserDto } from './user.dto';
import type { Response } from 'express';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { User } from 'src/common/decorators/user.decorator';
import type { UserI } from 'src/common/interfaces/global.interface';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async createUser(@Body() body: CreateUserDto, @Res() res: Response) {
    const { token } = await this.userService.createUser(body);
    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });
    return res.json({ message: 'User created' });
  }

  @Post('login')
  async login(@Body() body: LoginUserDto, @Res() res: Response) {
    const { token } = await this.userService.login(body);
    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });
    return res.json({ token, message: 'User logged in' });
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@User() user: UserI) {
    return this.userService.getUserById(user.id);
  }
}
