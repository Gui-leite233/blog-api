import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
export interface LoginDto {
    username: string;
    password: string;
}

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.usersService.findByUsername(username);
        if (user && await bcrypt.compare(password, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }



    async login(loginDto: LoginDto) {
        const { username, password } = loginDto;
        const user = await this.usersService.findByUsername(username);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        const payload = { username: user.username, sub: user._id, roles: user.roles };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user._id,
                username: user.username,
                roles: user.roles,
            },
        };
    }


}
