import { Injectable } from '@nestjs/common';
import { User, Wallet } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TransactionService {
    constructor(
        private prisma: PrismaService
    ) { }
    
    async getAuthUserTransactions(user: User) {
       return await this.prisma.transaction.findMany({
            where : {
                userId : user.id
            }
       });
    }
}
