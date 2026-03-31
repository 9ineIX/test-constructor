import { PrismaService } from '../prisma/prisma.service';
export declare class TestsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: {
        title: string;
        description?: string;
        authorId: string;
        categoryIds?: string[];
    }): Promise<{
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
        _count: {
            questions: number;
            results: number;
        };
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
    }>;
    findAll(userId?: string, userRole?: string): Promise<({
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
        _count: {
            questions: number;
            results: number;
        };
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
    })[]>;
    findById(id: string, userId?: string, userRole?: string): Promise<{
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
        _count: {
            questions: number;
            results: number;
        };
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
    }>;
    update(id: string, data: {
        title?: string;
        description?: string;
        categoryIds?: string[];
    }, userId?: string, userRole?: string): Promise<{
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
        _count: {
            questions: number;
            results: number;
        };
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
    }>;
    delete(id: string, userId?: string, userRole?: string): Promise<{
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
    }>;
    getAvailableTestsForStudent(studentId: string): Promise<({
        _count: {
            questions: number;
            results: number;
        };
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
    })[]>;
    getStudentCompletedTests(studentId: string): Promise<({
        test: {
            _count: {
                questions: number;
                results: number;
            };
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
}
