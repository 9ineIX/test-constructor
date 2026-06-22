import { useState, useEffect } from 'react';
import { Plus, Users, Settings, FileText, Edit, Trash2, Shield, Database, TrendingUp } from 'lucide-react';
import { usersAPI, rolesAPI, testsAPI, categoriesAPI, resultsAPI } from '../services/api';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const userSchema = z.object({
  email: z.string().email('Некорректный email адрес'),
  name: z.string().min(2, 'Имя должно содержать минимум 2 символа').optional(),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов').optional().or(z.literal('')),
  roleId: z.string().min(1, 'Выберите роль'),
});

type UserFormData = z.infer<typeof userSchema>;

const roleSchema = z.object({
  name: z.string().min(3, 'Название роли должно содержать минимум 3 символа').regex(/^[A-Z_]+$/, 'Название роли должно содержать только заглавные буквы и подчеркивания'),
});

type RoleFormData = z.infer<typeof roleSchema>;

const categorySchema = z.object({
  name: z.string().min(2, 'Название категории должно содержать минимум 2 символа').regex(/^[a-zA-Zа-яА-ЯёЁ0-9\s\-]+$/, 'Название категории может содержать только буквы, цифры, пробелы и дефисы'),
  description: z.string().optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [tests, setTests] = useState([]);
  const [categories, setCategories] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');
  
  // Forms
  const [showUserForm, setShowUserForm] = useState(false);
  const [showRoleForm, setShowRoleForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editingRole, setEditingRole] = useState<any>(null);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  
  const {
    register: registerUser,
    handleSubmit: handleSubmitUser,
    formState: { errors: userErrors },
    reset: resetUser,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      email: '',
      name: '',
      password: '',
      roleId: '',
    },
  });

  const {
    register: registerRole,
    handleSubmit: handleSubmitRole,
    formState: { errors: roleErrors },
    reset: resetRole,
  } = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: '',
    },
  });

  const {
    register: registerCategory,
    handleSubmit: handleSubmitCategory,
    formState: { errors: categoryErrors },
    reset: resetCategory,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    try {
      const [usersRes, rolesRes, testsRes, categoriesRes, resultsRes] = await Promise.all([
        usersAPI.getAll(),
        rolesAPI.getAll(),
        testsAPI.getAll(),
        categoriesAPI.getAll(),
        resultsAPI.getAll()
      ]);
      
      setUsers(usersRes.data || []);
      setRoles(rolesRes.data || []);
      setTests(testsRes.data || []);
      setCategories(categoriesRes.data || []);
      setResults(resultsRes.data || []);
    } catch (error) {
      console.error('Error loading admin data:', error);
      toast.error('Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (data: UserFormData) => {
    try {
      const userData: any = {
        email: data.email,
        name: data.name,
        roleId: data.roleId,
      };
      if (data.password) {
        userData.password = data.password;
      }
      await usersAPI.create(userData);
      toast.success('Пользователь создан');
      setShowUserForm(false);
      resetUser();
      loadData();
    } catch (error) {
      toast.error('Ошибка создания пользователя');
    }
  };

  const handleUpdateUser = async (data: UserFormData) => {
    if (!editingUser) return;
    
    try {
      const userData: any = {
        email: data.email,
        name: data.name,
        roleId: data.roleId,
      };
      if (data.password) {
        userData.password = data.password;
      }
      await usersAPI.update(editingUser.id, userData);
      toast.success('Пользователь обновлен');
      setShowUserForm(false);
      setEditingUser(null);
      resetUser();
      loadData();
    } catch (error) {
      toast.error('Ошибка обновления пользователя');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этого пользователя?')) return;
    
    try {
      await usersAPI.delete(userId);
      toast.success('Пользователь удален');
      loadData();
    } catch (error) {
      toast.error('Ошибка удаления пользователя');
    }
  };

  const handleCreateRole = async (data: RoleFormData) => {
    try {
      await rolesAPI.create(data);
      toast.success('Роль создана');
      setShowRoleForm(false);
      resetRole();
      loadData();
    } catch (error) {
      toast.error('Ошибка создания роли');
    }
  };

  const handleUpdateRole = async (data: RoleFormData) => {
    if (!editingRole) return;
    
    try {
      await rolesAPI.update(editingRole.id, data);
      toast.success('Роль обновлена');
      setShowRoleForm(false);
      setEditingRole(null);
      resetRole();
      loadData();
    } catch (error) {
      toast.error('Ошибка обновления роли');
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту роль?')) return;
    
    try {
      await rolesAPI.delete(roleId);
      toast.success('Роль удалена');
      loadData();
    } catch (error) {
      toast.error('Ошибка удаления роли');
    }
  };

  const handleCreateCategory = async (data: CategoryFormData) => {
    try {
      await categoriesAPI.create(data);
      toast.success('Категория создана');
      setShowCategoryForm(false);
      resetCategory();
      loadData();
    } catch (error) {
      toast.error('Ошибка создания категории');
    }
  };

  const handleUpdateCategory = async (data: CategoryFormData) => {
    if (!editingCategory) return;
    
    try {
      await categoriesAPI.update(editingCategory.id, data);
      toast.success('Категория обновлена');
      setShowCategoryForm(false);
      setEditingCategory(null);
      resetCategory();
      loadData();
    } catch (error) {
      toast.error('Ошибка обновления категории');
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту категорию?')) return;
    
    try {
      await categoriesAPI.delete(categoryId);
      toast.success('Категория удалена');
      loadData();
    } catch (error) {
      toast.error('Ошибка удаления категории');
    }
  };

  const handleDeleteTest = async (testId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот тест?')) return;
    
    try {
      await testsAPI.delete(testId);
      toast.success('Тест удален');
      loadData();
    } catch (error) {
      toast.error('Ошибка удаления теста');
    }
  };

  const openUserForm = (user: any = null) => {
    setEditingUser(user);
    resetUser(user ? {
      email: user.email,
      name: user.name,
      password: '',
      roleId: user.roleId
    } : {
      email: '',
      name: '',
      password: '',
      roleId: ''
    });
    setShowUserForm(true);
  };

  const openRoleForm = (role: any = null) => {
    setEditingRole(role);
    resetRole(role ? { name: role.name } : { name: '' });
    setShowRoleForm(true);
  };

  const openCategoryForm = (category: any = null) => {
    setEditingCategory(category);
    resetCategory(category ? {
      name: category.name,
      description: category.description || ''
    } : {
      name: '',
      description: ''
    });
    setShowCategoryForm(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Панель администратора</h1>
        <p className="text-gray-600 mt-2">Управляйте пользователями, ролями и системными настройками</p>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Пользователи</p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Роли</p>
              <p className="text-2xl font-bold text-gray-900">{roles.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Тесты</p>
              <p className="text-2xl font-bold text-gray-900">{tests.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Database className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Категории</p>
              <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Табы */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {[
              { id: 'users', label: 'Пользователи', icon: Users },
              { id: 'roles', label: 'Роли', icon: Shield },
              { id: 'tests', label: 'Тесты', icon: FileText },
              { id: 'categories', label: 'Категории', icon: Database }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-6 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4 inline mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Пользователи */}
          {activeTab === 'users' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Пользователи</h2>
                <button
                  onClick={() => openUserForm()}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить пользователя
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Имя</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Роль</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Действия</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user: any) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.role?.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => openUserForm(user)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Роли */}
          {activeTab === 'roles' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Роли</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Название</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Действия</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {roles.map((role: any) => (
                      <tr key={role.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{role.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => openRoleForm(role)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteRole(role.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Тесты */}
          {activeTab === 'tests' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Тесты</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Название</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Автор</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Вопросов</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Действия</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tests.map((test: any) => (
                      <tr key={test.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{test.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{test.author?.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{test.questions?.length || 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleDeleteTest(test.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Категории */}
          {activeTab === 'categories' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Категории</h2>
                <button
                  onClick={() => openCategoryForm()}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить категорию
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Название</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Описание</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Действия</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {categories.map((category: any) => (
                      <tr key={category.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{category.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{category.description}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => openCategoryForm(category)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Модальные окна форм */}
      {showUserForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {editingUser ? 'Редактирование пользователя' : 'Создание пользователя'}
            </h3>
            <form onSubmit={editingUser ? handleSubmitUser(handleUpdateUser) : handleSubmitUser(handleCreateUser)}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Имя</label>
                  <input
                    {...registerUser('name')}
                    type="text"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      userErrors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {userErrors.name && (
                    <p className="mt-1 text-sm text-red-600">{userErrors.name.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    {...registerUser('email')}
                    type="email"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      userErrors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {userErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{userErrors.email.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Пароль</label>
                  <input
                    {...registerUser('password')}
                    type="password"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      userErrors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={editingUser ? 'Оставьте пустым для сохранения текущего' : ''}
                  />
                  {userErrors.password && (
                    <p className="mt-1 text-sm text-red-600">{userErrors.password.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Роль</label>
                  <select
                    {...registerUser('roleId')}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      userErrors.roleId ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Выберите роль</option>
                    {roles.map((role: any) => (
                      <option key={role.id} value={role.id}>{role.name}</option>
                    ))}
                  </select>
                  {userErrors.roleId && (
                    <p className="mt-1 text-sm text-red-600">{userErrors.roleId.message}</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {editingUser ? 'Обновить' : 'Создать'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserForm(false);
                      resetUser();
                    }}
                    className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {showRoleForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {editingRole ? 'Редактирование роли' : 'Создание роли'}
            </h3>
            <form onSubmit={editingRole ? handleSubmitRole(handleUpdateRole) : handleSubmitRole(handleCreateRole)}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Название</label>
                  <input
                    {...registerRole('name')}
                    type="text"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      roleErrors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {roleErrors.name && (
                    <p className="mt-1 text-sm text-red-600">{roleErrors.name.message}</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {editingRole ? 'Обновить' : 'Создать'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowRoleForm(false);
                      resetRole();
                    }}
                    className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCategoryForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {editingCategory ? 'Редактирование категории' : 'Создание категории'}
            </h3>
            <form onSubmit={editingCategory ? handleSubmitCategory(handleUpdateCategory) : handleSubmitCategory(handleCreateCategory)}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Название</label>
                  <input
                    {...registerCategory('name')}
                    type="text"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      categoryErrors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {categoryErrors.name && (
                    <p className="mt-1 text-sm text-red-600">{categoryErrors.name.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Описание</label>
                  <textarea
                    {...registerCategory('description')}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {editingCategory ? 'Обновить' : 'Создать'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCategoryForm(false);
                      resetCategory();
                    }}
                    className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
