import { IsString, IsEmail } from 'class-validator';
import { Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  id: string;
  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  phone: string;

  @Expose()
  role: string;

  @Expose()
  address: {
    address: string;
    city: string;
    country: string;
    PostalCode: number;
  };
}
