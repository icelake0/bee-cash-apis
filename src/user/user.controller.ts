import { Body, Controller, Get, Patch, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { UpdateUserDto, UpdateUserPasswordDto } from './dto';
import { UserService } from './user.service';
import { ResponseFormatInterceptor } from 'src/interceptors';

@UseGuards(JwtGuard)
@Controller('/api/v1/users')
export class UserController {

    constructor(private userService: UserService) {}

    @Get('auth-user')
    getAuthUser(@AuthUser() user: User) {
        return user;
    }

    @UseInterceptors(new ResponseFormatInterceptor("Account updated successfully"))
    @Put('auth-user')
    updateAuthUser(@AuthUser() user: User, @Body() dto: UpdateUserDto) {
       return  this.userService.updateAuthUser(user, dto);
    }

    @UseInterceptors(new ResponseFormatInterceptor("Password updated successfully"))
    @Patch('auth-user/update-password')
    updateAuthUserPassword(@AuthUser() user: User, @Body() dto: UpdateUserPasswordDto) {
       return  this.userService.updateAuthUserPassword(user, dto);
    }
}
