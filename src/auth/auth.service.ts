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
            
            // Extract _id safely and ensure it's a string
            const userId = user._id ? user._id.toString() : null;
            if (!userId) {
                throw new UnauthorizedException('User ID is missing');
            }
            
            const payload = { 
                sub: userId,
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