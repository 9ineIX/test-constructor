export interface User {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  createdAt: string;
}

export interface Role {
  id: string;
  name: string;
}

export interface Test {
  id: string;
  title: string;
  description: string | null;
  authorId: string;
  author: User;
  categories: Category[];
  questions: Question[];
  createdAt: string;
  updatedAt: string;
  _count: {
    questions: number;
    results: number;
  };
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
}

export interface Question {
  id: string;
  text: string;
  order: number;
  testId: string;
  typeId: string;
  type: QuestionType;
  options: Option[];
}

export interface QuestionType {
  id: string;
  name: string;
  label: string;
}

export interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
  questionId: string;
}

export interface Result {
  id: string;
  score: number;
  testId: string;
  test: Test;
  userId: string;
  user: User;
  answers: Record<string, any>;
  createdAt: string;
}

export interface CreateTestDto {
  title: string;
  description?: string;
  categoryIds?: string[];
}

export interface CreateQuestionDto {
  text: string;
  order: number;
  testId: string;
  typeId: string;
  options: { text: string; isCorrect: boolean }[];
}

export interface CreateResultDto {
  testId: string;
  answers: Record<string, any>;
}
