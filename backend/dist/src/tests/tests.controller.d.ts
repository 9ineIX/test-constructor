import { TestsService } from './tests.service';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
export declare class TestsController {
    private readonly testsService;
    constructor(testsService: TestsService);
    create(createTestDto: CreateTestDto, req: any): Promise<{
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
    findAll(req: any): Promise<({
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
    getAvailableTests(req: any): Promise<({
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
    getCompletedTests(req: any): Promise<({
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
    findOne(id: string, req: any): Promise<{
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
    update(id: string, updateTestDto: UpdateTestDto, req: any): Promise<{
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
    remove(id: string, req: any): Promise<{
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
}
