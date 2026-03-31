import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ResultsService {
  constructor(private prisma: PrismaService) {}

  async create(data: { testId: string; userId: string; answers: any }) {
    const test = await this.prisma.test.findUnique({
      where: { id: data.testId },
      include: {
        questions: {
          include: {
            options: true,
            type: true,
          },
        },
        results: {
          where: {
            userId: data.userId,
          },
        },
      },
    });

    if (!test) {
      throw new NotFoundException('Test not found');
    }

    if (test.results.length > 0) {
      throw new BadRequestException('You have already completed this test');
    }

    let correctAnswers = 0;
    const totalQuestions = test.questions.length;

    console.log('Calculating score for test:', data.testId);
    console.log('Total questions:', totalQuestions);
    console.log('User answers:', data.answers);

    for (const question of test.questions) {
      const userAnswer = data.answers[question.id];
      if (!userAnswer) continue;

      const correctOptions = question.options.filter(option => option.isCorrect);
      console.log('Question:', question.text);
      console.log('User answer:', userAnswer);
      console.log('Correct options:', correctOptions);
      
      if (question.type.name === 'SINGLE') {
        const selectedOption = question.options.find(option => option.id === userAnswer[0]);
        if (selectedOption?.isCorrect) {
          correctAnswers++;
          console.log('Correct answer! Total correct:', correctAnswers);
        }
      } else if (question.type.name === 'MULTIPLE') {
        const userSelectedOptions = Array.isArray(userAnswer) ? userAnswer : [userAnswer];
        const correctOptionIds = correctOptions.map(option => option.id);
        
        if (userSelectedOptions.length === correctOptionIds.length &&
            userSelectedOptions.every(id => correctOptionIds.includes(id))) {
          correctAnswers++;
          console.log('Correct multiple choice! Total correct:', correctAnswers);
        }
      } else if (question.type.name === 'TEXT') {
        if (typeof userAnswer === 'string' && userAnswer.trim().toLowerCase() === 
            correctOptions[0]?.text.trim().toLowerCase()) {
          correctAnswers++;
          console.log('Correct text answer! Total correct:', correctAnswers);
        }
      }
    }

    const percentage = (correctAnswers / totalQuestions) * 100;
    let score = 2;

    if (percentage >= 90) score = 5;
    else if (percentage >= 70) score = 4;
    else if (percentage >= 50) score = 3;

    console.log('Final calculation:');
    console.log('Correct answers:', correctAnswers);
    console.log('Total questions:', totalQuestions);
    console.log('Percentage:', percentage);
    console.log('Score:', score);

    return this.prisma.result.create({
      data: {
        testId: data.testId,
        userId: data.userId,
        score,
        answers: data.answers,
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
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }

  async findAll(userId?: string, userRole?: string) {
    if (userRole === 'TEACHER' && userId) {
      const teacherTests = await this.prisma.test.findMany({
        where: {
          authorId: userId,
        },
        select: {
          id: true,
        },
      });

      const testIds = teacherTests.map(test => test.id);

      return this.prisma.result.findMany({
        where: {
          testId: {
            in: testIds,
          },
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
            },
          },
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    }

    if (userRole === 'STUDENT' && userId) {
      return this.prisma.result.findMany({
        where: {
          userId: userId,
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
            },
          },
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    }

    return this.prisma.result.findMany({
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
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id: string, userId?: string, userRole?: string) {
    const result = await this.prisma.result.findUnique({
      where: { id },
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
            questions: {
              include: {
                options: true,
                type: true,
              },
              orderBy: {
                order: 'asc',
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    if (!result) {
      throw new NotFoundException('Result not found');
    }

    if (userRole === 'TEACHER' && result.test.authorId !== userId) {
      throw new ForbiddenException('You can only view results from your own tests');
    }

    if (userRole === 'STUDENT' && result.userId !== userId) {
      throw new ForbiddenException('You can only view your own results');
    }

    return result;
  }

  async getTestResults(testId: string, userId?: string, userRole?: string) {
    const test = await this.prisma.test.findUnique({
      where: { id: testId },
    });

    if (!test) {
      throw new NotFoundException('Test not found');
    }

    if (userRole === 'TEACHER' && test.authorId !== userId) {
      throw new ForbiddenException('You can only view results from your own tests');
    }

    return this.prisma.result.findMany({
      where: {
        testId: testId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
