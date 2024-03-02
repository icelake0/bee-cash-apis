import { Body, Controller, Get, UseGuards } from '@nestjs/common';
import { AuthUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { TransactionService } from './transaction.service';
import { User } from '@prisma/client';
import { ValidateTransactionsDto } from '../dto';

@UseGuards(JwtGuard)
@Controller('/api/v1/wallet/transactions')
export class TransactionController {
    
    constructor(private transactionService: TransactionService) {}

    @Get('auth-user')
    getAuthUserTransactions(@AuthUser() user: User) {
        return this.transactionService.getAuthUserTransactions(user);
    }

    @Get('validate')
    validateTransactions(@AuthUser() user: User, @Body() dto: ValidateTransactionsDto) {
        return this.transactionService.validateTransactions(dto);
    }
}
