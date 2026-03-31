import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TestsService {
  constructor(private prisma: PrismaService) {}

  async create(data: { title: string; description?: string; authorId: string; categoryIds?: string[] }) {
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

  async findAll(userId?: string, userRole?: string) {
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

  async findById(id: string, userId?: string, userRole?: string) {
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
      throw new NotFoundException('Test not found');
    }

    if (userRole === 'TEACHER' && test.authorId !== userId) {
      throw new ForbiddenException('You can only view your own tests');
    }

    return test;
  }

  async update(id: string, data: { title?: string; description?: string; categoryIds?: string[] }, userId?: string, userRole?: string) {
    const test = await this.prisma.test.findUnique({
      where: { id },
    });

    if (!test) {
      throw new NotFoundException('Test not found');
    }

    if (userRole === 'TEACHER' && test.authorId !== userId) {
      throw new ForbiddenException('You can only update your own tests');
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

  async delete(id: string, userId?: string, userRole?: string) {
    const test = await this.prisma.test.findUnique({
      where: { id },
    });

    if (!test) {
      throw new NotFoundException('Test not found');
    }

    if (userRole === 'TEACHER' && test.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own tests');
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

  async getAvailableTestsForStudent(studentId: string) {
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

  async getStudentCompletedTests(studentId: string) {
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
}
