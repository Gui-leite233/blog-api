import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from '../users/dto/login.dto';
import { User } from 'src/users/schemas/users.schema';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async validateUser(username: string, password: string): Promise<any> {
        try {
            const user = await this.usersService.findByUsername(username);
            
            if (!user) {
                throw new UnauthorizedException('User not found');
            }
            
            if (await bcrypt.compare(password, user.password)) {
                const { password, ...result } = user;
                return result;
            }
            throw new UnauthorizedException('Invalid password');
        } catch (error) {
            console.error('Validation error:', error);
            throw new UnauthorizedException('Invalid credentials');
        }
    }

    async login(loginDto: LoginDto) {
        try {
            const { username, password } = loginDto;
            const user = await this.usersService.findByUsername(username);
            
            if (!user) {
                throw new UnauthorizedException('User not found');
            }
            
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new UnauthorizedException('Invalid password');
            }
            
            const payload = { 
                sub: user._id.toString(),
                username: user.username, 
                roles: user.roles 
              };
            return {
                access_token: this.jwtService.sign(payload),
                user: {
                    username: user.username,
                    roles: user.roles,
                },
            };
        } catch (error) {
            console.error('Login error:', error);
            throw new UnauthorizedException('Invalid credentials');
        }
    }
}
