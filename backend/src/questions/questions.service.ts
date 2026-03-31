import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  async create(data: { text: string; order: number; testId: string; typeId: string; options: { text: string; isCorrect: boolean }[] }, userId?: string, userRole?: string) {
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
        throw new NotFoundException('Test not found');
      }

      if (userRole === 'TEACHER' && test.authorId !== userId) {
        throw new ForbiddenException('You can only add questions to your own tests');
      }

      if (test.questions.length >= 10) {
        throw new BadRequestException('Test cannot have more than 10 questions');
      }

      if (data.options.length > 4) {
        throw new BadRequestException('Question cannot have more than 4 options');
      }

      const hasCorrectOption = data.options.some(option => option.isCorrect);
      if (!hasCorrectOption) {
        throw new BadRequestException('Question must have at least one correct option');
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
    } catch (error) {
      console.error('Error creating question:', error);
      throw error;
    }
  }

  async findAll(testId?: string) {
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

  async findById(id: string, userId?: string, userRole?: string) {
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
      throw new NotFoundException('Question not found');
    }

    if (userRole === 'TEACHER' && question.test.authorId !== userId) {
      throw new ForbiddenException('You can only view questions from your own tests');
    }

    return question;
  }

  async update(id: string, data: { text?: string; order?: number; typeId?: string; options?: { text: string; isCorrect: boolean }[] }, userId?: string, userRole?: string) {
    const question = await this.prisma.question.findUnique({
      where: { id },
      include: {
        test: true,
        options: true,
      },
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    if (userRole === 'TEACHER' && question.test.authorId !== userId) {
      throw new ForbiddenException('You can only update questions from your own tests');
    }

    const { options, ...updateData } = data;

    if (options && options.length > 4) {
      throw new BadRequestException('Question cannot have more than 4 options');
    }

    if (options) {
      const hasCorrectOption = options.some(option => option.isCorrect);
      if (!hasCorrectOption) {
        throw new BadRequestException('Question must have at least one correct option');
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

  async delete(id: string, userId?: string, userRole?: string) {
    const question = await this.prisma.question.findUnique({
      where: { id },
      include: {
        test: true,
      },
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    if (userRole === 'TEACHER' && question.test.authorId !== userId) {
      throw new ForbiddenException('You can only delete questions from your own tests');
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
}
