# Конструктор тестов для преподавателей

Полноценное production-ready веб-приложение для создания и прохождения тестов.

## Технологии

- **Backend**: NestJS, Prisma, PostgreSQL, JWT
- **Frontend**: React, Vite, TypeScript, Zustand
- **DevOps**: Docker, Docker Compose

## Запуск проекта

1. Запустите все сервисы:
```bash
docker-compose up --build
```

2. Приложение будет доступно:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001
   - База данных: localhost:5432

## Роли
cd /home/nine/CascadeProjects/test-constructor/backend && DATABASE_URL="postgresql://postgres:postgres@localhost:5432/test_constructor" npm run start:dev



- **STUDENT**: Прохождение тестов
- **TEACHER**: Создание тестов и управление студентами
- **ADMIN**: Полное управление системой

## Структура проекта

```
test-constructor/
├── backend/          # NestJS приложение
├── frontend/         # React приложение
├── docker-compose.yml
└── README.md
```
