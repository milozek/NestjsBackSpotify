import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository, UpdateResult } from 'typeorm';
import { CreateUserDTO } from './dto/create-user-dto';
import * as bcrypt from 'bcryptjs';
import { LoginDTO } from 'src/auth/dto/login.dto';
import { v4 as uuid4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>, // 1
  ) {}
  async create(userDTO: CreateUserDTO): Promise<User> {
    const user = new User();
    user.firstName = userDTO.firstName;
    user.lastName = userDTO.lastName;
    user.email = userDTO.email;
    user.apiKey = uuid4();
    user.phone = userDTO.phone;
    // user.password = userDTO.password;

    const salt = await bcrypt.genSalt(); // 2
    user.password = await bcrypt.hash(userDTO.password, salt); // 3

    const savedUser = await this.userRepository.save(user); // 4
    delete savedUser.password; // 5
    return savedUser; // 6
  }

  async findOne(data: LoginDTO /*Partial<User>*/): Promise<User> {
    const user = await this.userRepository.findOneBy({ email: data.email });
    if (!user) {
      throw new UnauthorizedException('Could not find user');
    }
    return user;
  }

  async findById(userId: number): Promise<User> {
    return this.userRepository.findOneBy({ id: userId });
  }

  async updateSecretKey(userId: number, secret: string): Promise<UpdateResult> {
    return this.userRepository.update(
      { id: userId },
      { twoFASecret: secret, enable2FA: true },
    );
  }

  async disable2FA(userId: number): Promise<UpdateResult> {
    try {
      return await this.userRepository.update(
        { id: userId },
        { enable2FA: false, twoFASecret: null },
      );
    } catch (e) {
      throw new UnauthorizedException('error when disabling 2FA', e);
    }
  }

  async findByApiKey(apiKey: string): Promise<User> {
    return await this.userRepository.findOneBy({ apiKey });
  }
}
