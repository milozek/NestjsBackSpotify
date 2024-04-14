import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginDTO } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ArtistsService } from 'src/artists/artists.service';
import { PayloadType } from './types/payload.type';
import { Enable2FAType } from './types/auth.types';
import * as speakeasy from 'speakeasy';
import { UpdateResult } from 'typeorm';
import { User } from 'src/users/users.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private artistsService: ArtistsService,
    private configService: ConfigService,
  ) {}

  async login(
    loginDTO: LoginDTO,
  ): Promise<
    { accessToken: string } | { validate2FA: string; message: string } /*User*/
  > {
    const user = await this.usersService.findOne(loginDTO);

    const passwordMatched = await bcrypt.compare(
      loginDTO.password,
      user.password,
    );

    if (passwordMatched) {
      delete user.password;
      // return user;
      const payload: PayloadType = { email: user.email, userId: user.id };

      const artist = await this.artistsService.findArtist(user.id);
      if (artist) {
        payload.artistId = artist.id;
      }

      if (user.enable2FA && user.twoFASecret) {
        // sends the validateToken request link
        // else sends the jwt in response
        return {
          validate2FA: 'http://localhost:3000/auth/validate-2fa',
          // This is to implement on the frontend: the user must provide their token to this link
          message:
            'Please send the "one time password" / token from your Google Authenticator App',
        };
      }

      return { accessToken: this.jwtService.sign(payload) };
    } else {
      throw new UnauthorizedException('The email or password are incorrect');
    }
  }

  async enable2FA(userId: number): Promise<Enable2FAType> {
    const user = await this.usersService.findById(userId);
    if (user.enable2FA) {
      return { secret: user.twoFASecret };
    }

    const secret = speakeasy.generateSecret();
    console.log('secret: ', secret);
    user.twoFASecret = secret.base32;
    await this.usersService.updateSecretKey(user.id, user.twoFASecret);
    return { secret: user.twoFASecret };
  }

  async validate2FAToken(
    userId: number,
    token: string,
  ): Promise<{ verified: boolean }> {
    try {
      const user = await this.usersService.findById(userId);
      const verified = speakeasy.totp.verify({
        secret: user.twoFASecret,
        token: token,
        encoding: 'base32',
      });

      if (verified) {
        return { verified: true };
      } else {
        return { verified: false };
      }
    } catch (e) {
      throw new UnauthorizedException('Error verifying token', e);
    }
  }

  async disable2FA(userId: number): Promise<UpdateResult> {
    return await this.usersService.disable2FA(userId);
  }

  async validateUserByApiKey(apiKey: string): Promise<User> {
    try {
      return await this.usersService.findByApiKey(apiKey);
    } catch (e) {
      throw new UnauthorizedException('Error verifying API Key', e);
    }
  }

  // console.log(this.configService.get<number>('port'));
  getEnvVariable() {
    const port = this.configService.get<number>('port');
    console.log('port: ', port);
    return port;
  }
}
