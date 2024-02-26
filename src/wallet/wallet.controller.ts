import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { WalletService } from './wallet.service';
import { SendMoneyDto } from './dto';
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
}
