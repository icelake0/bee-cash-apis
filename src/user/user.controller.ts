import { Body, Controller, Get, Patch, Put, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { UpdateUserDto, UpdateUserPasswordDto } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('/api/v1/users')
export class UserController {

    constructor(private userService: UserService) {}

    @Get('auth-user')
    getAuthUser(@AuthUser() user: User) {
        return user;
    }
    
    @Put('auth-user')
    updateAuthUser(@AuthUser() user: User, @Body() dto: UpdateUserDto) {
       return  this.userService.updateAuthUser(user, dto);
    }

    @Patch('auth-user/update-password')
    updateAuthUserPassword(@AuthUser() user: User, @Body() dto: UpdateUserPasswordDto) {
       return  this.userService.updateAuthUserPassword(user, dto);
    }
}
