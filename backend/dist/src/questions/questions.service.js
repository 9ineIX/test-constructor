"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let QuestionsService = class QuestionsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data, userId, userRole) {
        try {
            console.log('Creating question with data:', data);
            console.log('User:', userId, 'Role:', userRole);
            const test = await this.prisma.test.findUnique({
                where: { id: data.testId },
                include: {
                    questions: true,
                },
            });
            if (!test) {
                throw new common_1.NotFoundException('Test not found');
            }
            if (userRole === 'TEACHER' && test.authorId !== userId) {
                throw new common_1.ForbiddenException('You can only add questions to your own tests');
            }
            if (test.questions.length >= 10) {
                throw new common_1.BadRequestException('Test cannot have more than 10 questions');
            }
            const existingQuestionWithSameOrder = test.questions.find(q => q.order === data.order);
            if (existingQuestionWithSameOrder) {
                throw new common_1.BadRequestException(`Question with order ${data.order} already exists in this test`);
            }
            if (data.options.length < 2) {
                throw new common_1.BadRequestException('Question must have at least 2 options');
            }
            if (data.options.length > 4) {
                throw new common_1.BadRequestException('Question cannot have more than 4 options');
            }
            const hasCorrectOption = data.options.some(option => option.isCorrect);
            if (!hasCorrectOption) {
                throw new common_1.BadRequestException('Question must have at least one correct option');
            }
            const hasEmptyOption = data.options.some(option => !option.text || option.text.trim() === '');
            if (hasEmptyOption) {
                throw new common_1.BadRequestException('Question options cannot be empty');
            }
            const result = await this.prisma.question.create({
                data: {
                    ...data,
                    options: {
                        create: data.options,
                    },
                },
                include: {
                    options: true,
                    type: true,
                    test: {
                        select: {
                            id: true,
                            title: true,
                            authorId: true,
                        },
                    },
                },
            });
            console.log('Question created successfully:', result);
            return result;
        }
        catch (error) {
            console.error('Error creating question:', error);
            throw error;
        }
    }
    async findAll(testId) {
        if (testId) {
            return this.prisma.question.findMany({
                where: { testId },
                include: {
                    options: true,
                    type: true,
                    test: {
                        select: {
                            id: true,
                            title: true,
                            authorId: true,
                        },
                    },
                },
                orderBy: {
                    order: 'asc',
                },
            });
        }
        return this.prisma.question.findMany({
            include: {
                options: true,
                type: true,
                test: {
                    select: {
                        id: true,
                        title: true,
                        authorId: true,
                    },
                },
            },
            orderBy: {
                order: 'asc',
            },
        });
    }
    async findById(id, userId, userRole) {
        const question = await this.prisma.question.findUnique({
            where: { id },
            include: {
                options: true,
                type: true,
                test: {
                    select: {
                        id: true,
                        title: true,
                        authorId: true,
                    },
                },
            },
        });
        if (!question) {
            throw new common_1.NotFoundException('Question not found');
        }
        if (userRole === 'TEACHER' && question.test.authorId !== userId) {
            throw new common_1.ForbiddenException('You can only view questions from your own tests');
        }
        return question;
    }
    async update(id, data, userId, userRole) {
        const question = await this.prisma.question.findUnique({
            where: { id },
            include: {
                test: true,
                options: true,
            },
        });
        if (!question) {
            throw new common_1.NotFoundException('Question not found');
        }
        if (userRole === 'TEACHER' && question.test.authorId !== userId) {
            throw new common_1.ForbiddenException('You can only update questions from your own tests');
        }
        const { options, ...updateData } = data;
        if (options) {
            if (options.length < 2) {
                throw new common_1.BadRequestException('Question must have at least 2 options');
            }
            if (options.length > 4) {
                throw new common_1.BadRequestException('Question cannot have more than 4 options');
            }
            const hasCorrectOption = options.some(option => option.isCorrect);
            if (!hasCorrectOption) {
                throw new common_1.BadRequestException('Question must have at least one correct option');
            }
            const hasEmptyOption = options.some(option => !option.text || option.text.trim() === '');
            if (hasEmptyOption) {
                throw new common_1.BadRequestException('Question options cannot be empty');
            }
        }
        return this.prisma.question.update({
            where: { id },
            data: {
                ...updateData,
                ...(options && {
                    options: {
                        deleteMany: {},
                        create: options,
                    },
                }),
            },
            include: {
                options: true,
                type: true,
                test: {
                    select: {
                        id: true,
                        title: true,
                        authorId: true,
                    },
                },
            },
        });
    }
    async delete(id, userId, userRole) {
        const question = await this.prisma.question.findUnique({
            where: { id },
            include: {
                test: true,
            },
        });
        if (!question) {
            throw new common_1.NotFoundException('Question not found');
        }
        if (userRole === 'TEACHER' && question.test.authorId !== userId) {
            throw new common_1.ForbiddenException('You can only delete questions from your own tests');
        }
        return this.prisma.question.delete({
            where: { id },
            include: {
                options: true,
                type: true,
                test: {
                    select: {
                        id: true,
                        title: true,
                        authorId: true,
                    },
                },
            },
        });
    }
    async getQuestionTypes() {
        return this.prisma.questionType.findMany({
            orderBy: {
                name: 'asc',
            },
        });
    }
};
exports.QuestionsService = QuestionsService;
exports.QuestionsService = QuestionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], QuestionsService);
//# sourceMappingURL=questions.service.js.map