import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { SigninDto, SigninWithPinDto, SignupDto } from './dto';
import { ConfigService } from '@nestjs/config';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(
        private prisma: PrismaService,
        private config: ConfigService,
        private jwt: JwtService,
    ) { }

    async signup(dto: SignupDto) {
        const password = await argon.hash(dto.password);

        try {
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    username: dto.username,
                    password: password,
                    firstName: dto.firstName,
                    lastName: dto.lastName,
                    wallet: {
                        create: { },
                    },
                }
            });
            delete user.password;
            const access_token: string = await this.signToken(user.id, user.email);
            return {
                user,
                access_token
            }
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

    async signin(dto: SigninDto) {
        const user =
          await this.prisma.user.findUnique({
            where: {
              email: dto.email,
            },
          });

        if (!user)
          throw new ForbiddenException(
            'Credentials incorrect',
          );
    
        const passwordIsvalid = await argon.verify(
          user.password,
          dto.password,
        );
        if (!passwordIsvalid)
          throw new ForbiddenException(
            'Credentials incorrect',
          );
        delete user.password;
        delete user.pin;
        const access_token: string = await this.signToken(user.id, user.email);
        return {
            user,
            access_token
        }
    }

    async signinWithPin(dto: SigninWithPinDto) {
        const user =
          await this.prisma.user.findUnique({
            where: {
              email: dto.email,
            },
          });

        if (!user)
          throw new ForbiddenException(
            'Credentials incorrect',
          );

        if (!user.pin)
          throw new ForbiddenException(
            'You are not setup for pin signin',
          );
    
        const passwordIsvalid = await argon.verify(
          user.pin,
          dto.pin,
        );
        if (!passwordIsvalid)
          throw new ForbiddenException(
            'Credentials incorrect',
          );
        delete user.password;
        delete user.pin;
        const access_token: string = await this.signToken(user.id, user.email);
        return {
            user,
            access_token
        }
    }

    async signToken(
        userId: number,
        email: string,
    ): Promise<string> {
        const payload = {
            sub: userId,
            email,
        };
        const secret = this.config.get('JWT_SECRET');

        return await this.jwt.signAsync(
            payload,
            {
                expiresIn: '15m',
                secret: secret,
            },
        );
    }
}
