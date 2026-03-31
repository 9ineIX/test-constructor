import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: { email: string; password: string; name?: string; roleId: string }) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
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
      // Сначала попробуем простой запрос без связок
      const users = await this.prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          roleId: true,
        },
      });
      console.log('Users found:', users.length);
      
      // Затем попробуем загрузить роли для каждого пользователя
      const usersWithRoles = await Promise.all(
        users.map(async (user) => {
          try {
            const role = user.roleId ? await this.prisma.role.findUnique({
              where: { id: user.roleId },
              select: { id: true, name: true }
            }) : null;
            return { ...user, role };
          } catch (e) {
            console.error('Error loading role for user', user.id, e);
            return { ...user, role: null };
          }
        })
      );
      
      return usersWithRoles;
    } catch (error) {
      console.error('Error in findAll:', error);
      throw error;
    }
  }

  async findById(id: string) {
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

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        role: true,
      },
    });
  }

  async update(id: string, data: { email?: string; name?: string; roleId?: string }) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (data.email && data.email !== user.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }
    }

    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        roleId: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async delete(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

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

  async updatePassword(id: string, newPassword: string) {
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

  async getStudentsByTeacher(teacherId: string) {
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
      throw new NotFoundException('Teacher not found or user is not a teacher');
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
}
