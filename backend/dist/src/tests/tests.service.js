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
exports.TestsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TestsService = class TestsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        const { categoryIds = [], ...testData } = data;
        return this.prisma.test.create({
            data: {
                ...testData,
                categories: {
                    connect: categoryIds.map(id => ({ id })),
                },
            },
            include: {
                author: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    },
                },
                categories: true,
                questions: {
                    include: {
                        options: true,
                        type: true,
                    },
                    orderBy: {
                        order: 'asc',
                    },
                },
                _count: {
                    select: {
                        questions: true,
                        results: true,
                    },
                },
            },
        });
    }
    async findAll(userId, userRole) {
        if (userRole === 'TEACHER' && userId) {
            return this.prisma.test.findMany({
                where: {
                    authorId: userId,
                },
                include: {
                    author: {
                        select: {
                            id: true,
                            email: true,
                            name: true,
                        },
                    },
                    categories: true,
                    questions: {
                        include: {
                            options: true,
                            type: true,
                        },
                        orderBy: {
                            order: 'asc',
                        },
                    },
                    _count: {
                        select: {
                            questions: true,
                            results: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });
        }
        return this.prisma.test.findMany({
            include: {
                author: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    },
                },
                categories: true,
                questions: {
                    include: {
                        options: true,
                        type: true,
                    },
                    orderBy: {
                        order: 'asc',
                    },
                },
                _count: {
                    select: {
                        questions: true,
                        results: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async findById(id, userId, userRole) {
        const test = await this.prisma.test.findUnique({
            where: { id },
            include: {
                author: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    },
                },
                categories: true,
                questions: {
                    include: {
                        options: true,
                        type: true,
                    },
                    orderBy: {
                        order: 'asc',
                    },
                },
                _count: {
                    select: {
                        questions: true,
                        results: true,
                    },
                },
            },
        });
        if (!test) {
            throw new common_1.NotFoundException('Test not found');
        }
        if (userRole === 'TEACHER' && test.authorId !== userId) {
            throw new common_1.ForbiddenException('You can only view your own tests');
        }
        return test;
    }
    async update(id, data, userId, userRole) {
        const test = await this.prisma.test.findUnique({
            where: { id },
        });
        if (!test) {
            throw new common_1.NotFoundException('Test not found');
        }
        if (userRole === 'TEACHER' && test.authorId !== userId) {
            throw new common_1.ForbiddenException('You can only update your own tests');
        }
        const { categoryIds, ...updateData } = data;
        return this.prisma.test.update({
            where: { id },
            data: {
                ...updateData,
                ...(categoryIds && {
                    categories: {
                        set: categoryIds.map(id => ({ id })),
                    },
                }),
            },
            include: {
                author: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    },
                },
                categories: true,
                questions: {
                    include: {
                        options: true,
                        type: true,
                    },
                    orderBy: {
                        order: 'asc',
                    },
                },
                _count: {
                    select: {
                        questions: true,
                        results: true,
                    },
                },
            },
        });
    }
    async delete(id, userId, userRole) {
        const test = await this.prisma.test.findUnique({
            where: { id },
        });
        if (!test) {
            throw new common_1.NotFoundException('Test not found');
        }
        if (userRole === 'TEACHER' && test.authorId !== userId) {
            throw new common_1.ForbiddenException('You can only delete your own tests');
        }
        return this.prisma.test.delete({
            where: { id },
            include: {
                author: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    },
                },
                categories: true,
            },
        });
    }
    async getAvailableTestsForStudent(studentId) {
        const completedTestIds = await this.prisma.result.findMany({
            where: {
                userId: studentId,
            },
            select: {
                testId: true,
            },
        });
        const completedIds = completedTestIds.map(result => result.testId);
        return this.prisma.test.findMany({
            where: {
                id: {
                    notIn: completedIds,
                },
            },
            include: {
                author: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    },
                },
                categories: true,
                _count: {
                    select: {
                        questions: true,
                        results: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async getStudentCompletedTests(studentId) {
        return this.prisma.result.findMany({
            where: {
                userId: studentId,
            },
            include: {
                test: {
                    include: {
                        author: {
                            select: {
                                id: true,
                                email: true,
                                name: true,
                            },
                        },
                        categories: true,
                        _count: {
                            select: {
                                questions: true,
                                results: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
};
exports.TestsService = TestsService;
exports.TestsService = TestsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TestsService);
//# sourceMappingURL=tests.service.js.map