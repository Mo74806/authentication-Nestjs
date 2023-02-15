import { IsString, IsEmail, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  phone: string;

  @IsOptional()
  address: {
    address: string;
    city: string;
    country: string;
    PostalCode: number;
  };
}
