import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserPinDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(4)
  pin: string;
}