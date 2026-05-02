import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { JwtService } from 'src/common/service/jwt.service';
import { CreateUserDto, LoginUserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    private readonly jwtService: JwtService,
  ) {}

  async createUser(body: CreateUserDto) {
    const user = await this.userRepository.create(body).save();
    const token = this.jwtService.sign({ id: user.id }, { expiresIn: '1h' });
    console.log('User created:', token);
    return { token, user };
  }

  async login(body: LoginUserDto) {
    const user = await this.userRepository.findOneBy({ email: body.email });
    if (!user || user.password !== body.password) {
      throw new Error('Invalid credentials');
    }
    const token = this.jwtService.sign({ id: user.id }, { expiresIn: '1d' });
    return { token };
  }
  async getUserById(id: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .select(['user.id', 'user.fullName', 'user.email'])
      .where('user.id = :id', { id })
      .getOne();

    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}
