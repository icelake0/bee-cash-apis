import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class UserService {
    constructor(
        private prisma: PrismaService
    ) {}
    async updateAuthUser(user : User, dto: UpdateUserDto) {
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
}
