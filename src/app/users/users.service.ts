import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { users } from '@prisma/client';
import { hashSync } from 'bcrypt';
import { PrismaService } from 'src/database/prisma.service';
import { MessagesHelper } from 'src/helpers/messages.helper';
import { RegexHelper } from 'src/helpers/regex.helper';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async create(data: CreateUserDto) {
    const user = await findUser(data.email, this.prismaService);

    if (user)
      throw new UnauthorizedException(MessagesHelper.EMAIL_ALREADY_EXIST);

    data.password = hashSync(data.password, 10);

    return this.prismaService.users.create({ data });
  }

  findAll() {
    return this.prismaService.users.findMany({
      select: {
        id: true,
        name: true,
        lastName: true,
        email: true,
      },
    });
  }

  async findOne(id: string) {
    const user = await findUser(id, this.prismaService);

    if (!user) throw new NotFoundException(MessagesHelper.USER_NOT_FOUND);

    return user;
  }

  async update(id: string, data: UpdateUserDto) {
    return this.prismaService.users.update({
      where: validateEmail(id) ? { email: id } : { id },
      data,
    });
  }

  async destroy(id: string) {
    await this.prismaService.users.delete({
      where: validateEmail(id) ? { email: id } : { id },
    });
  }
}

function validateEmail(email: string) {
  return String(email).toLowerCase().match(RegexHelper.EMAIL);
}

async function findUser(
  id: string,
  prismaService: PrismaService,
): Promise<users> {
  return await prismaService.users.findUnique({
    where: validateEmail(id) ? { email: id } : { id },
  });
}
