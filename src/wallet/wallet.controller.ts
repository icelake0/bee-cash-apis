import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { WalletService } from './wallet.service';
import { SendMoneyDto, TopUpWalletDto } from './dto';
import { AuthUser } from 'src/auth/decorator';
import { User } from '@prisma/client';
import { ResponseFormatInterceptor } from 'src/interceptors';

@UseGuards(JwtGuard)
@Controller('/api/v1/wallet')
export class WalletController {
    constructor(private walletService: WalletService) {}

    @HttpCode(HttpStatus.OK)
    @UseInterceptors(new ResponseFormatInterceptor("Payment successful"))
    @Post('make-payment')
    makePayment(@AuthUser() user: User, @Body() dto: SendMoneyDto) {
        return this.walletService.makePayment(user, dto);        
    }

    @HttpCode(HttpStatus.OK)
    @UseInterceptors(new ResponseFormatInterceptor("Wallet found successful"))
    @Get('auth-user/view-wallet')
    viewWallet(@AuthUser() user: User) {
        return this.walletService.viewWallet(user);        
    }

    @HttpCode(HttpStatus.OK)
    @UseInterceptors(new ResponseFormatInterceptor("Wallet topuped successful"))
    @Post('auth-user/topup-wallet')
    topupWallet(@AuthUser() user: User, @Body() dto: TopUpWalletDto) {
        return this.walletService.topupWallet(user, dto);        
    }
}
