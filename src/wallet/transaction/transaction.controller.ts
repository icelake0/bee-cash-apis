import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { TransactionService } from './transaction.service';
import { User } from '@prisma/client';

@UseGuards(JwtGuard)
@Controller('/api/v1/wallet/transactions')
export class TransactionController {
    
    constructor(private transactionService: TransactionService) {}

    @Get('auth-user')
    getAuthUserTransactions(@AuthUser() user: User) {
        return this.transactionService.getAuthUserTransactions(user);
    }

    @Get('auth-user/seed')
    seeAuthUserTransactions(@AuthUser() user: User) {
        return user;
    }
}
