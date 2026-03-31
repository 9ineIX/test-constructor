import { PrismaService } from '../prisma/prisma.service';
export declare class QuestionsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: {
        text: string;
        order: number;
        testId: string;
        typeId: string;
        options: {
            text: string;
            isCorrect: boolean;
        }[];
    }, userId?: string, userRole?: string): Promise<{
        test: {
            id: string;
            title: string;
            authorId: string;
        };
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
    }>;
    findAll(testId?: string): Promise<({
        test: {
            id: string;
            title: string;
            authorId: string;
        };
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
    })[]>;
    findById(id: string, userId?: string, userRole?: string): Promise<{
        test: {
            id: string;
            title: string;
            authorId: string;
        };
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
    }>;
    update(id: string, data: {
        text?: string;
        order?: number;
        typeId?: string;
        options?: {
            text: string;
            isCorrect: boolean;
        }[];
    }, userId?: string, userRole?: string): Promise<{
        test: {
            id: string;
            title: string;
            authorId: string;
        };
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
    }>;
    delete(id: string, userId?: string, userRole?: string): Promise<{
        test: {
            id: string;
            title: string;
            authorId: string;
        };
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
    }>;
    getQuestionTypes(): Promise<{
        id: string;
        name: string;
        label: string;
    }[]>;
}
