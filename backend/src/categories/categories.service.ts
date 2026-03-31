import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(data: { name: string; description?: string }) {
    const existingCategory = await this.prisma.category.findUnique({
      where: { name: data.name },
    });

    if (existingCategory) {
      throw new ConflictException('Category with this name already exists');
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

  async findById(id: string) {
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
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async update(id: string, data: { name?: string; description?: string }) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (data.name && data.name !== category.name) {
      const existingCategory = await this.prisma.category.findUnique({
        where: { name: data.name },
      });

      if (existingCategory) {
        throw new ConflictException('Category with this name already exists');
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

  async delete(id: string) {
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
      throw new NotFoundException('Category not found');
    }

    if (category._count.tests > 0) {
      throw new ConflictException('Cannot delete category that has associated tests');
    }

    return this.prisma.category.delete({
      where: { id },
    });
  }
}
