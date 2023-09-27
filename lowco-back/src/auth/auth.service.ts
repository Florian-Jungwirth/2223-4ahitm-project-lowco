import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserDetails } from '../user/entities/user.entity';
import { ExistingUserDto } from '../user/dto/existing-user.dto';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
  constructor(private userService: UserService, private jwtService: JwtService) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12)
  }

  async register(user: Readonly<CreateUserDto>): Promise <UserDetails | any>{
    const { firstname, lastname, username, email, password} = user;

    const existingUser = await this.userService.findByMail(email);
    if(existingUser) return new HttpException('Benutzer existiert bereits', HttpStatus.FORBIDDEN)

    const hashedPassword = await this.hashPassword(password);
    const newUser = await this.userService.create(firstname, lastname, username, email, hashedPassword);
    return this.userService._getUserDetails(newUser);
  }

  async passwordMatch(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserDetails | null> {
    const user = await this.userService.findByMail(email);
    const userExist = !!user;

    if (!userExist) return null;

    const doespasswordMatch = await this.passwordMatch(password, user.password)
    if (!doespasswordMatch) return null;

    return this.userService._getUserDetails(user);
  }

  async login(existingUser: ExistingUserDto): Promise<{ token: string } | any> {
    const { email, password } = existingUser;
    
    const user = await this.validateUser(email, password);

    if (!user) return new HttpException('Falsches Passwort', HttpStatus.FORBIDDEN);

    const jwt = await this.jwtService.signAsync({ user });
    return { token: jwt };
  }
}
