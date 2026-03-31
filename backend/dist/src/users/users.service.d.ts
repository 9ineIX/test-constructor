import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: {
        email: string;
        password: string;
        name?: string;
        roleId: string;
    }): Promise<{
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
    findById(id: string): Promise<{
        id: string;
        name: string;
        role: {
            id: string;
            name: string;
        };
        email: string;
        roleId: string;
    }>;
    findByEmail(email: string): Promise<{
        role: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        name: string | null;
        email: string;
        password: string;
        roleId: string;
    }>;
    update(id: string, data: {
        email?: string;
        name?: string;
        roleId?: string;
    }): Promise<{
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
    delete(id: string): Promise<{
        id: string;
        name: string;
        role: {
            id: string;
            name: string;
        };
        email: string;
        roleId: string;
    }>;
    updatePassword(id: string, newPassword: string): Promise<{
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
}
