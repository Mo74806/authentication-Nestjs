import { Injectable, Session } from '@nestjs/common';
import { UsersService } from './users.service';
import { Response } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { User, UserDocument } from 'src/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UserDto } from 'src/dtos/userDto.dto';
import { CreateUserDto } from 'src/dtos/createUserDto.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async signup(user: CreateUserDto, res) {
    try {
      //create new user
      const newUser = await this.usersService.createUser(user);
      //create a jwt token for the user
      this.createSendToken(newUser, 201, res);
    } catch (e) {
      //if there any validation error with user data
      res.status(400).json({ status: 'fail', message: e.message });
    }
  }

  signToken = (id) => {
    //create the jwt token
    return jwt.sign(
      { id },
      process.env.JWT_SECRET || 'this_is_a_temporary_secret_for_jwt',
      {
        expiresIn: '90d',
      },
    );
  };

  createSendToken(user, statusCode, res) {
    //save the token in cookie
    const token = this.signToken(user._id);
    const cookieOptions = {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };
    res.cookie('jwt', token, cookieOptions);
    // Remove password from response
    user.password = undefined;
    user.token = token;
    return res.status(statusCode).json({
      status: 'success',
      token,
      data: {
        user,
      },
    });
  }

  async signin(body: any, res) {
    //1)check if the mail and password is there
    if (!body.email || !body.password)
      return res
        .status(400)
        .json({ message: 'please provide email and password' });

    //2)if there a user with provided mail
    //if there is a user get his data +hashed password
    let user = await this.userModel
      .findOne({ email: body.email })
      .select('+password');
    if (!user)
      return res
        .status(401)
        .json({ message: 'email or password might be wrong' });
    //3)check if the password is correct
    if (!(await bcrypt.compare(body.password, user.password)))
      return res
        .status(401)
        .json({ message: 'email or password might be wrong' });
    //4)if all up there is correct create jwt token and send it to user
    this.createSendToken(user, 200, res);
  }
}
