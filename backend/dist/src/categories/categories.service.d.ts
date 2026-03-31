import { PrismaService } from '../prisma/prisma.service';
export declare class CategoriesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: {
        name: string;
        description?: string;
    }): Promise<{
        _count: {
            tests: number;
        };
    } & {
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
    }>;
    findAll(): Promise<({
        _count: {
            tests: number;
        };
    } & {
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
    })[]>;
    findById(id: string): Promise<{
        tests: ({
            _count: {
                questions: number;
                results: number;
            };
            author: {
                id: string;
                name: string;
                email: string;
            };
        } & {
            id: string;
            description: string | null;
            createdAt: Date;
            title: string;
            authorId: string;
            updatedAt: Date;
        })[];
        _count: {
            tests: number;
        };
    } & {
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
    }>;
    update(id: string, data: {
        name?: string;
        description?: string;
    }): Promise<{
        _count: {
            tests: number;
        };
    } & {
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
    }>;
    delete(id: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
    }>;
}
