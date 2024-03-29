import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class UpdateUserPasswordDto {
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  currentPassword: string;
}