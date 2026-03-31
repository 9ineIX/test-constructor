import { PrismaService } from '../prisma/prisma.service';
export declare class RolesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        name: string;
    }[]>;
    findById(id: string): Promise<{
        id: string;
        name: string;
    }>;
    findByName(name: string): Promise<{
        id: string;
        name: string;
    }>;
    create(data: {
        name: string;
    }): Promise<{
        id: string;
        name: string;
    }>;
    update(id: string, data: {
        name?: string;
    }): Promise<{
        id: string;
        name: string;
    }>;
    delete(id: string): Promise<{
        id: string;
        name: string;
    }>;
}
