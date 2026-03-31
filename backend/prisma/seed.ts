import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  const adminRole = await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: {
      name: 'ADMIN',
    },
  });

  const teacherRole = await prisma.role.upsert({
    where: { name: 'TEACHER' },
    update: {},
    create: {
      name: 'TEACHER',
    },
  });

  const studentRole = await prisma.role.upsert({
    where: { name: 'STUDENT' },
    update: {},
    create: {
      name: 'STUDENT',
    },
  });

  const singleType = await prisma.questionType.upsert({
    where: { name: 'SINGLE' },
    update: {},
    create: {
      name: 'SINGLE',
      label: 'Single Choice',
    },
  });

  const multipleType = await prisma.questionType.upsert({
    where: { name: 'MULTIPLE' },
    update: {},
    create: {
      name: 'MULTIPLE',
      label: 'Multiple Choice',
    },
  });

  const textType = await prisma.questionType.upsert({
    where: { name: 'TEXT' },
    update: {},
    create: {
      name: 'TEXT',
      label: 'Text Answer',
    },
  });

  const adminPassword = await bcrypt.hash('admin123', 10);
  const teacherPassword = await bcrypt.hash('teacher123', 10);
  const studentPassword = await bcrypt.hash('student123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      email: 'admin@test.com',
      password: adminPassword,
      name: 'Admin User',
      roleId: adminRole.id,
    },
  });

  const teacher = await prisma.user.upsert({
    where: { email: 'teacher@test.com' },
    update: {},
    create: {
      email: 'teacher@test.com',
      password: teacherPassword,
      name: 'Teacher User',
      roleId: teacherRole.id,
    },
  });

  const student = await prisma.user.upsert({
    where: { email: 'student@test.com' },
    update: {},
    create: {
      email: 'student@test.com',
      password: studentPassword,
      name: 'Student User',
      roleId: studentRole.id,
    },
  });

  const mathCategory = await prisma.category.upsert({
    where: { name: 'Математика' },
    update: {},
    create: {
      name: 'Математика',
      description: 'Математические тесты и упражнения',
    },
  });

  const physicsCategory = await prisma.category.upsert({
    where: { name: 'Физика' },
    update: {},
    create: {
      name: 'Физика',
      description: 'Тесты по физике и эксперименты',
    },
  });

  const chemistryCategory = await prisma.category.upsert({
    where: { name: 'Химия' },
    update: {},
    create: {
      name: 'Химия',
      description: 'Химические тесты и реакции',
    },
  });

  const russianCategory = await prisma.category.upsert({
    where: { name: 'Русский язык' },
    update: {},
    create: {
      name: 'Русский язык',
      description: 'Тесты по русскому языку и грамматике',
    },
  });

  const literatureCategory = await prisma.category.upsert({
    where: { name: 'Литература' },
    update: {},
    create: {
      name: 'Литература',
      description: 'Тесты по литературе и произведениям',
    },
  });

  const historyCategory = await prisma.category.upsert({
    where: { name: 'История' },
    update: {},
    create: {
      name: 'История',
      description: 'Исторические тесты и события',
    },
  });

  const geographyCategory = await prisma.category.upsert({
    where: { name: 'География' },
    update: {},
    create: {
      name: 'География',
      description: 'Географические тесты и страны',
    },
  });

  const biologyCategory = await prisma.category.upsert({
    where: { name: 'Биология' },
    update: {},
    create: {
      name: 'Биология',
      description: 'Биологические тесты и организмы',
    },
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
