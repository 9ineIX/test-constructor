import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3011';

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export interface RegisterResponse {
  message: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth-storage');
  if (token) {
    const authData = JSON.parse(token);
    if (authData.state?.accessToken) {
      config.headers.Authorization = `Bearer ${authData.state.accessToken}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const token = localStorage.getItem('auth-storage');
        if (token) {
          const authData = JSON.parse(token);
          if (authData.state?.refreshToken) {
            const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
              refreshToken: authData.state.refreshToken,
            });

            const { accessToken, refreshToken } = response.data;
            
            localStorage.setItem('auth-storage', JSON.stringify({
              state: {
                ...authData.state,
                accessToken,
                refreshToken,
              },
            }));

            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        localStorage.removeItem('auth-storage');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  register: (data: { email: string; password: string; name?: string }) =>
    api.post('/auth/register', data),
  
  refresh: (refreshToken: string) =>
    api.post('/auth/refresh', { refreshToken }),
  
  getProfile: () =>
    api.get('/auth/profile'),
};

export const testsAPI = {
  getAll: () =>
    api.get('/tests'),
  
  getById: (id: string) =>
    api.get(`/tests/${id}`),
  
  create: (data: { title: string; description?: string; categoryIds?: string[] }) =>
    api.post('/tests', data),
  
  update: (id: string, data: { title?: string; description?: string; categoryIds?: string[] }) =>
    api.patch(`/tests/${id}`, data),
  
  delete: (id: string) =>
    api.delete(`/tests/${id}`),
  
  getAvailable: () =>
    api.get('/tests/available'),
  
  getCompleted: () =>
    api.get('/tests/completed'),
};

export const questionsAPI = {
  getAll: (testId?: string) =>
    api.get('/questions', { params: { testId } }),
  
  getById: (id: string) =>
    api.get(`/questions/${id}`),
  
  create: (data: { text: string; order: number; testId: string; typeId: string; options: { text: string; isCorrect: boolean }[] }) =>
    api.post('/questions', data),
  
  update: (id: string, data: any) =>
    api.patch(`/questions/${id}`, data),
  
  delete: (id: string) =>
    api.delete(`/questions/${id}`),
  
  getTypes: () =>
    api.get('/questions/types'),
};

export const resultsAPI = {
  getAll: () =>
    api.get('/results'),
  
  getById: (id: string) =>
    api.get(`/results/${id}`),
  
  create: (data: { testId: string; answers: any }) =>
    api.post('/results', data),
  
  getTestResults: (testId: string) =>
    api.get(`/results/test/${testId}`),
  
  getStudentResults: (studentId: string) =>
    api.get(`/results/student/${studentId}`),
};

export const usersAPI = {
  getAll: () =>
    api.get('/users'),
  
  getById: (id: string) =>
    api.get(`/users/${id}`),
  
  create: (data: { email: string; password: string; name?: string; roleId: string }) =>
    api.post('/users', data),
  
  update: (id: string, data: { email?: string; name?: string; roleId?: string; password?: string }) =>
    api.patch(`/users/${id}`, data),
  
  delete: (id: string) =>
    api.delete(`/users/${id}`),
  
  getStudentsByTeacher: (teacherId: string) =>
    api.get(`/users/teacher/${teacherId}/students`),
  
  getTeacherStudents: (teacherId: string) =>
    api.get(`/users/teacher/${teacherId}/students`),
  
  getAllStudents: () =>
    api.get('/users/students'),
};

export const rolesAPI = {
  getAll: () =>
    api.get('/roles'),
  
  getById: (id: string) =>
    api.get(`/roles/${id}`),
  
  create: (data: { name: string }) =>
    api.post('/roles', data),
  
  update: (id: string, data: { name?: string }) =>
    api.patch(`/roles/${id}`, data),
  
  delete: (id: string) =>
    api.delete(`/roles/${id}`),
};

export const categoriesAPI = {
  getAll: () =>
    api.get('/categories'),
  
  getById: (id: string) =>
    api.get(`/categories/${id}`),
  
  create: (data: { name: string; description?: string }) =>
    api.post('/categories', data),
  
  update: (id: string, data: { name?: string; description?: string }) =>
    api.patch(`/categories/${id}`, data),
  
  delete: (id: string) =>
    api.delete(`/categories/${id}`),
};

export default api;
