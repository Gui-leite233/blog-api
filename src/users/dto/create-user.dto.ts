export class CreateUserDto {
    _id?: string;
    username: string;
    password: string;
    roles?: string[];
  }