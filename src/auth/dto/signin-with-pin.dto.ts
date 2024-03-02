import {
    IsEmail,
    IsNotEmpty,
    IsString,
    MaxLength,
    MinLength,
  } from 'class-validator';

export class SigninWithPinDto{
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(4)
  pin: string;
}