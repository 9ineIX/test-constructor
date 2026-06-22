"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = __importStar(require("bcryptjs"));
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: data.email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('User with this email already exists');
        }
        const hashedPassword = await bcrypt.hash(data.password, 10);
        return this.prisma.user.create({
            data: {
                ...data,
                password: hashedPassword,
            },
            select: {
                id: true,
                email: true,
                name: true,
                roleId: true,
                role: true,
            },
        });
    }
    async findAll() {
        try {
            console.log('Finding all users...');
            const users = await this.prisma.user.findMany({
                select: {
                    id: true,
                    email: true,
                    name: true,
                    roleId: true,
                },
            });
            console.log('Users found:', users.length);
            const usersWithRoles = await Promise.all(users.map(async (user) => {
                try {
                    const role = user.roleId ? await this.prisma.role.findUnique({
                        where: { id: user.roleId },
                        select: { id: true, name: true }
                    }) : null;
                    return { ...user, role };
                }
                catch (e) {
                    console.error('Error loading role for user', user.id, e);
                    return { ...user, role: null };
                }
            }));
            return usersWithRoles;
        }
        catch (error) {
            console.error('Error in findAll:', error);
            throw error;
        }
    }
    async findById(id) {
        return this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
                roleId: true,
                role: true,
            },
        });
    }
    async findByEmail(email) {
        return this.prisma.user.findUnique({
            where: { email },
            include: {
                role: true,
            },
        });
    }
    async update(id, data) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (data.email && data.email !== user.email) {
            const existingUser = await this.prisma.user.findUnique({
                where: { email: data.email },
            });
            if (existingUser) {
                throw new common_1.ConflictException('User with this email already exists');
            }
        }
        const updateData = {
            email: data.email,
            name: data.name,
            roleId: data.roleId,
        };
        if (data.password) {
            updateData.password = await bcrypt.hash(data.password, 10);
        }
        return this.prisma.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                email: true,
                name: true,
                roleId: true,
                role: true,
            },
        });
    }
    async delete(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                tests: true,
                results: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        await this.prisma.result.deleteMany({
            where: { userId: id },
        });
        await this.prisma.test.deleteMany({
            where: { authorId: id },
        });
        return this.prisma.user.delete({
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
                roleId: true,
                role: true,
            },
        });
    }
    async updatePassword(id, newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        return this.prisma.user.update({
            where: { id },
            data: { password: hashedPassword },
            select: {
                id: true,
                email: true,
                name: true,
                roleId: true,
                role: true,
            },
        });
    }
    async getStudentsByTeacher(teacherId) {
        const teacher = await this.prisma.user.findUnique({
            where: { id: teacherId },
            include: {
                role: true,
                tests: {
                    include: {
                        results: {
                            include: {
                                user: {
                                    include: {
                                        role: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
        if (!teacher || teacher.role.name !== 'TEACHER') {
            throw new common_1.NotFoundException('Teacher not found or user is not a teacher');
        }
        const studentMap = new Map();
        teacher.tests.forEach(test => {
            test.results.forEach(result => {
                if (result.user.role.name === 'STUDENT') {
                    const studentId = result.user.id;
                    if (!studentMap.has(studentId)) {
                        studentMap.set(studentId, {
                            ...result.user,
                            scores: [],
                            averageScore: 0,
                        });
                    }
                    studentMap.get(studentId).scores.push(result.score);
                }
            });
        });
        const students = Array.from(studentMap.values()).map(student => {
            const averageScore = student.scores.length > 0
                ? student.scores.reduce((sum, score) => sum + score, 0) / student.scores.length
                : 0;
            return {
                ...student,
                averageScore: Math.round(averageScore * 100) / 100,
            };
        });
        return students;
    }
    async getAllStudents() {
        const users = await this.prisma.user.findMany({
            where: {
                role: {
                    name: 'STUDENT',
                },
            },
            select: {
                id: true,
                email: true,
                name: true,
                roleId: true,
                role: true,
            },
        });
        return users;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map