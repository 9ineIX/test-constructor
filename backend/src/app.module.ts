import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { TestsModule } from './tests/tests.module';
import { QuestionsModule } from './questions/questions.module';
import { ResultsModule } from './results/results.module';
import { CategoriesModule } from './categories/categories.module';

import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, jwtConfig],
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    RolesModule,
    TestsModule,
    QuestionsModule,
    ResultsModule,
    CategoriesModule,
  ],
})
export class AppModule {}
