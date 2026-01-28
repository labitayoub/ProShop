import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findOrCreateUser(auth0Id: string, email: string, name?: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: auth0Id },
        });

        if (user) {
            // If user exists, we might want to update their name/email if it changed on Auth0 side
            return this.prisma.user.update({
                where: { id: auth0Id },
                data: { email, name },
            });
        }

        // Role defaults to BUYER in Prisma schema
        return this.prisma.user.create({
            data: {
                id: auth0Id,
                email,
                name,
            },
        });
    }
}
