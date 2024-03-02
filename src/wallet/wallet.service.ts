import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { TransactionStatus, TransactionType, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { SendMoneyDto, TopUpWalletDto } from './dto';

@Injectable()
export class WalletService {
    constructor(private prisma: PrismaService) { }

    async makePayment(senderUser: User, dto: SendMoneyDto) {

        //start a database transaction 
        return await this.prisma.$transaction(async (tx) => {
            
            const sender = await tx.user.findUnique({
                where: {
                    id: senderUser.id
                },
                include: {
                    wallet: true
                }
            });

            const receiver = await tx.user.findUnique({
                where: {
                    id: dto.receiverId
                },
                include: {
                    wallet: true
                }
            });

            //Check the the CR user is valid
            if(!receiver) {
                throw new BadRequestException("Invalid recipient")
            }

            if(sender.id == receiver.id) {
                throw new BadRequestException("You can't make payment to yourself")
            }

            if(sender.wallet.balance < dto.amount) {
                throw new BadRequestException('Insufficient funds')
            }

            const transactionRefPrefix = 'Ref-Bee-Cash-' + Date.now()+ "-"

            const previousSenderBalance = sender.wallet?.balance;
            const newSenderBalance = sender.wallet?.balance - dto.amount
            const senderTransactionRef = transactionRefPrefix + 'DR'

            await tx.wallet.update({
                where: {
                    id: sender.wallet.id
                },
                data: {
                    balance: newSenderBalance
                }
            })
            let senderTransaction = await tx.transaction.create({
                data: {
                    reference: senderTransactionRef,
                    type: TransactionType.DR,
                    status: TransactionStatus.PENDING,
                    walletId: sender.wallet.id,
                    userId: sender.id,
                    amount: dto.amount,
                    previousBalance: previousSenderBalance,
                    newBalance: newSenderBalance
                }
            })

            const previousReceiverBalance = receiver.wallet?.balance;
            const newReceiverBalance = receiver.wallet?.balance + dto.amount;
            const receiverTransactionRef = transactionRefPrefix + 'CR'
            let receiverTransaction = await tx.transaction.create({
                data: {
                    reference: receiverTransactionRef,
                    type: TransactionType.CR,
                    status: TransactionStatus.PENDING,
                    walletId: receiver.wallet.id,
                    userId: receiver.id,
                    amount: dto.amount,
                    previousBalance: previousReceiverBalance,
                    newBalance: newReceiverBalance
                }
            })
            await tx.wallet.update({
                where: {
                    id: receiver.wallet.id
                },
                data: {
                    balance: newReceiverBalance
                }
            })

            senderTransaction = await tx.transaction.update({
                where: {
                    id: senderTransaction.id,
                },
                data: {
                    status: TransactionStatus.COMPLETED
                }
            });

            receiverTransaction = await tx.transaction.update({
                where: {
                    id: receiverTransaction.id,
                },
                data: {
                    status: TransactionStatus.COMPLETED
                }
            })
            
            return {
                senderTransaction, receiverTransaction
            }

        });
    }

    async viewWallet(user: User) {
        return await this.prisma.wallet.findUnique({
            where: {
                userId: user.id
            }
        });
    }

    async topupWallet(walletUser: User, dto: TopUpWalletDto) {

        return await this.prisma.$transaction(async (tx) => {
            
            const user = await tx.user.findUnique({
                where: {
                    id: walletUser.id
                },
                include: {
                    wallet: true
                }
            });

            const previousBalance = user.wallet.balance;
            const newBalance = user.wallet.balance + dto.amount
            const transactionRef = 'Ref-Bee-Cash-' + Date.now()+ "-TOPUP-CR"

            const wallet = await tx.wallet.update({
                where: {
                    id: user.wallet.id
                },
                data: {
                    balance: newBalance
                }
            })
            const transaction = await tx.transaction.create({
                data: {
                    reference: transactionRef,
                    type: TransactionType.CR,
                    status: TransactionStatus.COMPLETED,
                    walletId: user.wallet.id,
                    userId: user.id,
                    amount: dto.amount,
                    previousBalance: previousBalance,
                    newBalance: newBalance
                }
            })
            
            return {wallet, transaction}

        });
    }
}
