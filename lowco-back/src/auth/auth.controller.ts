import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ExistingUserDto } from 'src/user/dto/existing-user.dto';
import { UserDetails } from 'src/user/entities/user.entity';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() user: CreateUserDto): Promise<UserDetails | null> {
    return this.authService.register(user);
  }

  @Post('login')
  login(@Body() user: ExistingUserDto): Promise<{ token: string } | null> {
    return this.authService.login(user);
  }
}
