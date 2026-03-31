import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
export declare class QuestionsController {
    private readonly questionsService;
    constructor(questionsService: QuestionsService);
    create(createQuestionDto: CreateQuestionDto, req: any): Promise<{
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
    findAll(testId?: string, req?: any): Promise<({
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
    getQuestionTypes(): Promise<{
        id: string;
        name: string;
        label: string;
    }[]>;
    findOne(id: string, req: any): Promise<{
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
    update(id: string, updateQuestionDto: UpdateQuestionDto, req: any): Promise<{
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
    remove(id: string, req: any): Promise<{
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
}
