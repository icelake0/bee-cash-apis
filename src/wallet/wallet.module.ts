import { Module } from '@nestjs/common';
import { TransactionController } from './transaction/transaction.controller';
import { TransactionService } from './transaction/transaction.service';

@Module({
  controllers: [TransactionController],
  providers: [TransactionService]
})
export class WalletModule {}
