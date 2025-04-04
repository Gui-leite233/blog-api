import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/users.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

    async create(CreateUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
        const { username, password, roles } = CreateUserDto;
    
        const existingUser = await this.userModel.findOne({ username });
        if (existingUser) {
            throw new Error('User already exists');
        }
    
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new this.userModel({
            ...CreateUserDto,
            password: hashedPassword,
        });
    
        const savedUser = await newUser.save();
        const { password: _, ...result } = savedUser.toObject();
    
        return result as Omit<User, 'password'>;
    }

    async findById(id: string): Promise<User | null> {
        return this.userModel.findById(id).select('-password').exec();
    }

    async findByUsername(username: string): Promise<User | null> {
        return this.userModel.findOne({ username }).select('-password').exec();
    }
}
