import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<{
        id: string;
        name: string;
        role: {
            id: string;
            name: string;
        };
        email: string;
        roleId: string;
    }>;
    findAll(): Promise<{
        role: {
            id: string;
            name: string;
        };
        id: string;
        name: string;
        email: string;
        roleId: string;
    }[]>;
    getProfile(): Promise<{
        role: {
            id: string;
            name: string;
        };
        id: string;
        name: string;
        email: string;
        roleId: string;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        role: {
            id: string;
            name: string;
        };
        email: string;
        roleId: string;
    }>;
    getStudentsByTeacher(teacherId: string): Promise<any[]>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<{
        id: string;
        name: string;
        role: {
            id: string;
            name: string;
        };
        email: string;
        roleId: string;
        createdAt: never;
    }>;
    updatePassword(id: string, updatePasswordDto: UpdatePasswordDto): Promise<{
        id: string;
        name: string;
        role: {
            id: string;
            name: string;
        };
        email: string;
        roleId: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        role: {
            id: string;
            name: string;
        };
        email: string;
        roleId: string;
    }>;
}
