import { User } from '@prisma/client';
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { MyJwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
@Controller('users')
export class UserController {
  @UseGuards(MyJwtGuard)
  @Get('me')
  me(@GetUser() user: User) {
    return user;
  }
}
