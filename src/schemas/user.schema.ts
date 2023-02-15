import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcrypt';
export type UserDocument = HydratedDocument<User>;

interface Iaddress {
  address: string;
  city: string;
  country: string;
  PostalCode: number;
}

@Schema({ timestamps: true, validateBeforeSave: true })
export class User {
  @Prop({
    required: [true, 'the name is required'],
    minlength: [5, 'name should be more than 5 char'],
  })
  name: string;

  @Prop({
    required: [true, 'the email is required'],
    unique: [true, 'mail must be uniqe'],
  })
  email: string;

  @Prop({ default: 'user' })
  role: string;

  @Prop({ required: [true, 'the phone is required'] })
  phone: string;

  @Prop({
    required: [true, 'the address is required'],
    type: {
      address: String,
      city: String,
      country: String,
      PostalCode: Number,
    },
  })
  address: Iaddress;

  @Prop({
    required: [true, 'the password is required'],
    minlength: [8, 'password should be more than 8 char'],
  })
  password: string;

  @Prop({
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!',
    },
  })
  passwordConfirm: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.pre<User>('save', async function (next: Function) {
  // Only run this function if password was actually modified
  // if (!this.modifed('password')) return next();
  if (this.password != this.passwordConfirm) {
    return;
  }
  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

UserSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
