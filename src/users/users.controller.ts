import {
  Controller,
  Param,
  Patch,
  Post,
  Session,
  Response,
  UseGuards,
} from '@nestjs/common';
import { Get, Body, Delete } from '@nestjs/common';
import { CreateUserDto } from 'src/dtos/createUserDto.dto';
import { UpdateUserDto } from 'src/dtos/updateUserDto.dto';
import { UsersService } from './users.service';
import { Serialize } from '../interceptors/serilalizeInterceptor.interceptor';
import { UserDto } from '../dtos/userDto.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '../gaurds/auth.guard';
import { AdminGuard } from 'src/gaurds/admin.guard';
import { SigninDto } from 'src/dtos/signinDto-dto';

@Controller('/users')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authservice: AuthService,
  ) {}
  @Post('/signup')
  async signup(@Body() body: CreateUserDto, @Response() res) {
    this.authservice.signup(body, res);
  }

  @Post('/login')
  async login(@Body() body: SigninDto, @Response() res) {
    this.authservice.signin(body, res);
  }

  @Get('/secret-route-for-user')
  @UseGuards(AuthGuard)
  async secret() {
    return 'this is a secret route';
  }

  @Get()
  @UseGuards(AdminGuard)
  async getAllUsers() {
    return await this.usersService.findUsers();
  }
  @Get('/:id')
  @UseGuards(AdminGuard)
  async getUser(@Param('id') id: string) {
    return await this.usersService.findUser(id);
  }
  @Post('/')
  @UseGuards(AdminGuard)
  async createUser(@Body() body: CreateUserDto) {
    return await this.usersService.createUser(body);
  }

  @Patch('/:id')
  @UseGuards(AdminGuard)
  async editUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return await this.usersService.updateUser(id, body);
  }

  @Delete('/:id')
  @UseGuards(AdminGuard)
  async deleteUser(@Param('id') id: string) {
    return await this.usersService.deleteUser(id);
  }
}
