import { Body, Controller, HttpCode, HttpStatus, Post, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto, SignupDto } from './dto';
import { ResponseFormatInterceptor } from 'src/interceptors';

@Controller('api/v1/auth')
export class AuthController {

    constructor(private authService: AuthService) {}
    @UseInterceptors(new ResponseFormatInterceptor("signup successfully"))
    @Post('signup')
    signup(@Body() dto: SignupDto) {
        return this.authService.signup(dto);
    }

    @UseInterceptors(new ResponseFormatInterceptor("login successfully"))
    @HttpCode(HttpStatus.OK)
    @Post('signin')
    signin(@Body() dto: SigninDto) {
      return this.authService.signin(dto);
    }
}
