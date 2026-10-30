# Test Constructor

A full-stack web application for creating and taking tests. Teachers build tests and manage their students; students take tests and see their results.

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)

## Table of Contents

- [Tech Stack](#tech-stack)
- [Roles](#roles)
- [Getting Started](#getting-started)
  - [Run with Docker](#run-with-docker)
  - [Local Development](#local-development)
- [Project Structure](#project-structure)

## Tech Stack

| Layer    | Technologies                          |
| -------- | ------------------------------------- |
| Backend  | NestJS, Prisma, PostgreSQL, JWT auth  |
| Frontend | React, Vite, TypeScript, Zustand      |
| DevOps   | Docker, Docker Compose                |

## Roles

| Role        | Permissions                                   |
| ----------- | --------------------------------------------- |
| **STUDENT** | Take tests                                    |
| **TEACHER** | Create tests and manage students              |
| **ADMIN**   | Full control over the system                  |

## Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose
- [Node.js](https://nodejs.org/) (only for local development without Docker)

### Run with Docker

Build and start all services:

```bash
docker-compose up --build
```

Once running, the services are available at:

| Service  | URL                     |
| -------- | ----------------------- |
| Frontend | http://localhost:3000   |
| Backend  | http://localhost:3001   |
| Database | `localhost:5432`        |

### Local Development

To run the backend outside of Docker (with hot reload), make sure PostgreSQL is running on `localhost:5432`, then:

```bash
cd backend
npm install
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/test_constructor" npm run start:dev
```

> **Tip:** instead of passing `DATABASE_URL` inline every time, put it in `backend/.env`:
>
> ```env
> DATABASE_URL="postgresql://postgres:postgres@localhost:5432/test_constructor"
> ```

To run the frontend:

```bash
cd frontend
npm install
npm run dev
```

## Project Structure

```
test-constructor/
├── backend/             # NestJS API
├── frontend/            # React client
├── docker-compose.yml
└── README.md
```
