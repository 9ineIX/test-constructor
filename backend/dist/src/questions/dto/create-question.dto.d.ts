export declare class CreateQuestionDto {
    text: string;
    order: number;
    testId: string;
    typeId: string;
    options: {
        text: string;
        isCorrect: boolean;
    }[];
}
