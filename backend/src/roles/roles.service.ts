import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.role.findMany();
  }

  async findById(id: string) {
    return this.prisma.role.findUnique({
      where: { id },
    });
  }

  async findByName(name: string) {
    return this.prisma.role.findUnique({
      where: { name },
    });
  }

  async create(data: { name: string }) {
    return this.prisma.role.create({
      data,
    });
  }

  async update(id: string, data: { name?: string }) {
    return this.prisma.role.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.role.delete({
      where: { id },
    });
  }
}
