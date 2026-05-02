import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { JwtService } from 'src/common/service/jwt.service';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [JwtService, UserService],
  exports: [UserService],
})
export class UserModule {}
