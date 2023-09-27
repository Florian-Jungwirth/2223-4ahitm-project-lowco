import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserDetails } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('all')
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<UserDetails | null> {
    return this.userService.findById(id);
  }

  @Patch('/changeName/:id')
  changeName(@Param('id') id: string, @Body() request: any): Promise<any> {
    return this.userService.changeName(id, request.firstname, request.lastname);
  }

  @Patch('/changePW/:id')
  changePassword(@Param('id') id: string, @Body() request: any): Promise<any> {
    return this.userService.changePassword(id, request.pw);
  }

  @Patch('/changeEmail/:id')
  changeEmail(@Param('id') id: string, @Body() request: any): Promise<any> {
    return this.userService.changeEmail(id, request.email);
  }

  @Patch(':id')
  changeMetric(@Param('id') id: string, @Body() request: any): Promise<any> {
    return this.userService.changeMetric(id, request.metric)
  }

  @Patch('/changeQuicks/:id')
  changeQuicks(@Param('id') id: string, @Body() request: any): Promise<any> {
    return this.userService.changeQuicks(id, request)
  }

  @Get('getQuicks/:id')
  getQuicks(@Param('id') id: string): Promise<UserDetails | null> {
    return this.userService.getQuicks(id);
  }
}