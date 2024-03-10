import { Injectable } from '@nestjs/common';
import { User, Wallet } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ValidateTransactionsDto } from '../dto';

@Injectable()
export class TransactionService {
    constructor(
        private prisma: PrismaService
    ) { }

    async getAuthUserTransactions(user: User) {
        return await this.prisma.transaction.findMany({
            where: {
                userId: user.id
            },
            orderBy: {
                id: 'desc'
            }
        });
    }

    async validateTransactions(dto: ValidateTransactionsDto) {
        const transactions = await this.prisma.transaction.findMany({
            where: {
                reference: { in: dto.transactionRefrences }
            }
        });

        const transactionMap = {};
        transactions.forEach((transaction) => {
            transactionMap[transaction.reference] = true
        })

        const transactionValidationMap = {};
        dto.transactionRefrences.forEach((transactionRefrence) => {
            transactionValidationMap[transactionRefrence] = transactionMap[transactionRefrence] || false
        })

        return transactionValidationMap;
    }
}
