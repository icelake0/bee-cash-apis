import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { TransactionStatus, TransactionType, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { SendMoneyDto } from './dto';

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
        //create a pending DR transaction record 
        //generate a DR transaction  refrence id
        //update the transaction with the refrence
        //check if balance can make transactions
        //get the CR user
        //create a pending CR transaction
        //update the DR wallet balance 
        //update the CR wallet balance 
        //set CR transaction status as completed 
        //Set DR transaction status as completed 
        //Return both CR and DR transaction in response
        //end database transaction
    }
}