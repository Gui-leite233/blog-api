import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/users.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

    async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
        const { username, password, roles } = createUserDto;
    
        const existingUser = await this.userModel.findOne({ username });
        if (existingUser) {
            throw new ConflictException('User already exists');
        }
    
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new this.userModel({
            ...createUserDto,
            password: hashedPassword,
        });
    
        const savedUser = await newUser.save();
        const { password: _, ...result } = savedUser.toObject();
    
        return result as Omit<User, 'password'>;
    }

    async findById(id: string): Promise<User | null> {
        // Validate that id is a valid ObjectId
        if (!Types.ObjectId.isValid(id)) {
            throw new NotFoundException(`Invalid user ID format: ${id}`);
        }
        
        const user = await this.userModel.findById(id).select('-password').exec();
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }

    async findByUsername(username: string): Promise<User | null> {
        const user = await this.userModel.findOne({ username }).exec();
        if (!user) {
            throw new NotFoundException(`User with username ${username} not found`);
        }
        return user;
    }
    
    async findAll(): Promise<User[]> {
        return this.userModel.find().select('-password').exec();
    }
}