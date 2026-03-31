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
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CategoriesService = class CategoriesService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        const existingCategory = await this.prisma.category.findUnique({
            where: { name: data.name },
        });
        if (existingCategory) {
            throw new common_1.ConflictException('Category with this name already exists');
        }
        return this.prisma.category.create({
            data,
            include: {
                _count: {
                    select: {
                        tests: true,
                    },
                },
            },
        });
    }
    async findAll() {
        return this.prisma.category.findMany({
            include: {
                _count: {
                    select: {
                        tests: true,
                    },
                },
            },
            orderBy: {
                name: 'asc',
            },
        });
    }
    async findById(id) {
        const category = await this.prisma.category.findUnique({
            where: { id },
            include: {
                tests: {
                    include: {
                        author: {
                            select: {
                                id: true,
                                email: true,
                                name: true,
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
                },
                _count: {
                    select: {
                        tests: true,
                    },
                },
            },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        return category;
    }
    async update(id, data) {
        const category = await this.prisma.category.findUnique({
            where: { id },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        if (data.name && data.name !== category.name) {
            const existingCategory = await this.prisma.category.findUnique({
                where: { name: data.name },
            });
            if (existingCategory) {
                throw new common_1.ConflictException('Category with this name already exists');
            }
        }
        return this.prisma.category.update({
            where: { id },
            data,
            include: {
                _count: {
                    select: {
                        tests: true,
                    },
                },
            },
        });
    }
    async delete(id) {
        const category = await this.prisma.category.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        tests: true,
                    },
                },
            },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        if (category._count.tests > 0) {
            throw new common_1.ConflictException('Cannot delete category that has associated tests');
        }
        return this.prisma.category.delete({
            where: { id },
        });
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map