import {
    IsInt,
    IsNotEmpty,
    IsNumber,
  } from 'class-validator';

export class SendMoneyDto {
  @IsInt()
  @IsNotEmpty()
  receiverId: number;

  @IsNumber({
    maxDecimalPlaces: 2
  })
  @IsNotEmpty()
  amount: number;
}