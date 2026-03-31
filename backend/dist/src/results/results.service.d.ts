import { PrismaService } from '../prisma/prisma.service';
export declare class ResultsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: {
        testId: string;
        userId: string;
        answers: any;
    }): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
        };
        test: {
            author: {
                id: string;
                name: string;
                email: string;
            };
            categories: {
                id: string;
                name: string;
                description: string | null;
                createdAt: Date;
            }[];
        } & {
            id: string;
            description: string | null;
            createdAt: Date;
            title: string;
            authorId: string;
            updatedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        score: number;
        testId: string;
        userId: string;
        answers: import("@prisma/client/runtime/library").JsonValue;
    }>;
    findAll(userId?: string, userRole?: string): Promise<({
        user: {
            id: string;
            name: string;
            email: string;
        };
        test: {
            author: {
                id: string;
                name: string;
                email: string;
            };
            categories: {
                id: string;
                name: string;
                description: string | null;
                createdAt: Date;
            }[];
        } & {
            id: string;
            description: string | null;
            createdAt: Date;
            title: string;
            authorId: string;
            updatedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        score: number;
        testId: string;
        userId: string;
        answers: import("@prisma/client/runtime/library").JsonValue;
    })[]>;
    findById(id: string, userId?: string, userRole?: string): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
        };
        test: {
            questions: ({
                type: {
                    id: string;
                    name: string;
                    label: string;
                };
                options: {
                    id: string;
                    text: string;
                    isCorrect: boolean;
                    questionId: string;
                }[];
            } & {
                id: string;
                testId: string;
                order: number;
                text: string;
                typeId: string;
            })[];
            author: {
                id: string;
                name: string;
                email: string;
            };
            categories: {
                id: string;
                name: string;
                description: string | null;
                createdAt: Date;
            }[];
        } & {
            id: string;
            description: string | null;
            createdAt: Date;
            title: string;
            authorId: string;
            updatedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        score: number;
        testId: string;
        userId: string;
        answers: import("@prisma/client/runtime/library").JsonValue;
    }>;
    getTestResults(testId: string, userId?: string, userRole?: string): Promise<({
        user: {
            id: string;
            name: string;
            email: string;
        };
    } & {
        id: string;
        createdAt: Date;
        score: number;
        testId: string;
        userId: string;
        answers: import("@prisma/client/runtime/library").JsonValue;
    })[]>;
}
