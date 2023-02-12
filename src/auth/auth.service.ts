import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { users } from '@prisma/client';
import { compareSync } from 'bcrypt';
import { UsersService } from 'src/app/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(user: any) {
    const payload = { sub: user.id, email: user.email };

    return {
      token: this.jwtService.sign(payload),
    };
  }

  async validateUser(email: string, password: string) {
    let user: users;

    try {
      user = await this.userService.findOne(email);
    } catch (error) {
      return null;
    }

    const passwordIsValid = compareSync(password, user.password);
    if (!passwordIsValid) return null;

    return user;
  }
}
