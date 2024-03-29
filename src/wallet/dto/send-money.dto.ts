import {
    IsInt,
    IsNotEmpty,
    IsNumber,
    Max,
    Min,
  } from 'class-validator';

export class SendMoneyDto {
  @IsInt()
  @IsNotEmpty()
  receiverId: number;

  @Min(0.01)
  @Max(5000)
  @IsNumber({
    maxDecimalPlaces: 2
  })
  @IsNotEmpty()
  amount: number;
}