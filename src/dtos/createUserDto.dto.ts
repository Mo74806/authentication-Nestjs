import { IsString, IsEmail, IsPhoneNumber } from 'class-validator';

interface Iaddress {
  address: string;
  city: string;
  country: string;
  PostalCode: number;
}

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  phone: string;

  address: Iaddress;

  @IsString()
  password: string;

  @IsString()
  passwordConfirm: string;
}
