import {
    IsInt,
    IsNotEmpty,
    IsNumber,
    Max,
    Min,
  } from 'class-validator';

export class TopUpWalletDto {
  @IsNumber({
    maxDecimalPlaces: 2
  })
  @IsNotEmpty()
  @Min(0.01)
  @Max(5000)
  amount: number;
}