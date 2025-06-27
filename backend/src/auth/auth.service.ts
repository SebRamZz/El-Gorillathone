import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from '../dtos/register.dto';

@Injectable()
export class AuthService {
  private readonly SALT_ROUNDS = 10;

  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, firstName, lastName, role, sector } = registerDto;

    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) throw new UnauthorizedException('Email already in use');

    const hashedPassword = await this.hashPassword(password);

    const user = await this.userService.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
        sector,
    });

    const token = this.generateToken(user);
    const { password: _pwd, ...userSafe } = user;

    return {
      access_token: token,
      user: userSafe,
    };
  }

  async login(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Email ou mot de passe invalide');

    const isPasswordValid = await this.validatePassword(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Email ou mot de passe invalide');

    const token = this.generateToken(user);
    const { password: _pwd, ...userSafe } = user;

    return {
      access_token: token,
      user: userSafe,
    };
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  private async validatePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  private generateToken(user: any): string {
    return this.jwtService.sign({
      userId: user.id,
      email: user.email
    });
  }
}
