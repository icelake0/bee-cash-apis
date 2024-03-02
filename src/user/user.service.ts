import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto, UpdateUserPasswordDto, UpdateUserPinDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as argon from 'argon2';

@Injectable()
export class UserService {
    constructor(
        private prisma: PrismaService
    ) { }
    async updateAuthUser(user: User, dto: UpdateUserDto) {
        try {
            const updatedUser = await this.prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    email: dto.email,
                    username: dto.username,
                    firstName: dto.firstName,
                    lastName: dto.lastName
                },
            });
            delete updatedUser.password;
            return updatedUser;
        } catch (error) {
            //Move this into the validation and also design the validation formating
            if (
                error instanceof
                PrismaClientKnownRequestError
            ) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException(
                        'Credentials taken',
                    );
                }
            }
            throw error;
        }
    }

    async updateAuthUserPassword(authUser: User, dto: UpdateUserPasswordDto) {
        const user =
          await this.prisma.user.findUnique({
            where: {
              id: authUser.id,
            },
          });
          
        const passwordIsvalid = await argon.verify(
            user.password,
            dto.currentPassword,
        );

        if (!passwordIsvalid)
            throw new ForbiddenException(
                'Credentials incorrect',
            );
        
        const password = await argon.hash(dto.password);

        const updatedUser = await this.prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                password: password
            },
        });
        delete updatedUser.password;
        delete updatedUser.pin;
        return updatedUser;
    }

    async updateAuthUserPin(authUser: User, dto: UpdateUserPinDto) {
        const user =
          await this.prisma.user.findUnique({
            where: {
              id: authUser.id,
            },
          });
        
        const pin = await argon.hash(dto.pin);

        const updatedUser = await this.prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                pin: pin
            },
        });
        delete updatedUser.password;
        delete updatedUser.pin;
        return updatedUser;
    }
}
