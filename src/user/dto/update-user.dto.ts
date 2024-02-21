import {
    IsEmail,
    IsNotEmpty,
    IsString,
  } from 'class-validator';

export class UpdateUserDto{
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  username: string

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName:  string;

}