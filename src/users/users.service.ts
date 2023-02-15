import { Injectable } from '@nestjs/common';
import { User, UserDocument } from 'src/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Error, Model } from 'mongoose';
import { CreateUserDto } from 'src/dtos/createUserDto.dto';
import { NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from 'src/dtos/updateUserDto.dto';
import { throwError } from 'rxjs';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findUsers(): Promise<User[]> {
    return await this.userModel.find();
  }

  async findUser(id: string): Promise<User> {
    return await this.userModel.findById(id);
  }

  async createUser(user: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(user);
    return createdUser.save();
  }
  async updateUser(id: string, attrs: Partial<User>): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('This user is not found');
    return await this.userModel.findByIdAndUpdate(
      id,
      { ...attrs },
      { new: true },
    );
  }

  async deleteUser(id: string): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('This user is not found');
    return this.userModel.findByIdAndRemove(id);
  }
}
