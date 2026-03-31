import { ReactNode } from 'react';
import { useAuthStore } from '../store/authStore';
import { LogOut, User, BookOpen, Users, Settings } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const getNavItems = () => {
    switch (user?.role) {
      case 'TEACHER':
        return [
          { name: 'Панель', href: '/teacher', icon: BookOpen },
          { name: 'Конструктор тестов', href: '/test-constructor', icon: Settings },
        ];
      case 'STUDENT':
        return [
          { name: 'Панель', href: '/student', icon: BookOpen },
        ];
      case 'ADMIN':
        return [
          { name: 'Панель', href: '/admin', icon: Settings },
          { name: 'Пользователи', href: '/admin/users', icon: Users },
        ];
      default:
        return [{ name: 'Панель', href: '/dashboard', icon: BookOpen }];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">Конструктор тестов</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">
                  {user?.name || user?.email}
                </span>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {user?.role === 'TEACHER' ? 'Преподаватель' : 
                   user?.role === 'STUDENT' ? 'Студент' : 
                   user?.role === 'ADMIN' ? 'Администратор' : user?.role}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-sm text-gray-500 hover:text-gray-700"
              >
                <LogOut className="w-4 h-4" />
                <span>Выйти</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {children}
        </div>
      </main>
    </div>
  );
}
