import { Injectable } from '@nestjs/common';
import { User, Note } from '@prisma/client';
@Injectable({})
export class AuthService {
  register() {
    return 'hello';
  }

  login() {
    return 'hello';
  }
}
