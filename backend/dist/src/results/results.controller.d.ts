import { ResultsService } from './results.service';
import { CreateResultDto } from './dto/create-result.dto';
export declare class ResultsController {
    private readonly resultsService;
    constructor(resultsService: ResultsService);
    create(createResultDto: CreateResultDto, req: any): Promise<{
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
    findAll(req: any): Promise<({
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
    getTestResults(testId: string, req: any): Promise<({
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
    findOne(id: string, req: any): Promise<{
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
}
