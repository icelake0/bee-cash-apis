import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { WalletService } from './wallet.service';
import { SendMoneyDto } from './dto';
import { AuthUser } from 'src/auth/decorator';
import { User } from '@prisma/client';

@UseGuards(JwtGuard)
@Controller('/api/v1/wallet')
export class WalletController {
    constructor(private walletService: WalletService) {}

    @Post('make-payment')
    makePayment(@AuthUser() user: User, @Body() dto: SendMoneyDto) {
        return this.walletService.makePayment(user, dto);        
    }
}
