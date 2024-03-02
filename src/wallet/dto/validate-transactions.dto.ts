import {
    IsArray,
    IsString,
  } from 'class-validator';

export class ValidateTransactionsDto {
  
  @IsArray()
  @IsString({ each: true })
  transactionRefrences: Array<string>;
}