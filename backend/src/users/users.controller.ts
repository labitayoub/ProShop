import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    // This endpoint can be called by Auth0 Action (M2M) or Frontend right after login
    // We secure it with JWT Guard so only valid tokens can create/sync a user
    @UseGuards(JwtAuthGuard)
    @Post('sync')
    async syncUser(@Req() req, @Body() body: { email: string; name?: string }) {
        // req.user contains the decoded JWT payload from Auth0
        // typically the Auth0 user ID is in req.user.sub
        const auth0Id = req.user.sub;

        return this.usersService.findOrCreateUser(auth0Id, body.email, body.name);
    }
}
