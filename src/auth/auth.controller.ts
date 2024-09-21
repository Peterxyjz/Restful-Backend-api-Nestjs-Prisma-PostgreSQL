import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() auth: AuthDTO) {
    return this.authService.register(auth);
  }

  @Post('login')
  login(@Body() auth: AuthDTO) {
    return this.authService.login(auth);
  }
}
