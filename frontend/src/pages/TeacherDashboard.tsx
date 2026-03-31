import { useState, useEffect } from 'react';
import { Plus, Users, FileText, TrendingUp } from 'lucide-react';
import { testsAPI, usersAPI, resultsAPI } from '../services/api';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export default function TeacherDashboard() {
  const [tests, setTests] = useState([]);
  const [students, setStudents] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [testsRes, studentsRes, resultsRes] = await Promise.all([
        testsAPI.getAll(),
        usersAPI.getTeacherStudents(user.id),
        resultsAPI.getAll()
      ]);
      
      setTests(testsRes.data);
      setStudents(studentsRes.data);
      setResults(resultsRes.data);
    } catch (error) {
      toast.error('Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  const getStudentAverageScore = (studentId: string) => {
    const studentResults = results.filter(r => r.userId === studentId);
    if (studentResults.length === 0) return 0;
    const totalScore = studentResults.reduce((sum, r) => sum + r.score, 0);
    return Math.round(totalScore / studentResults.length);
  };

  const getStudentAverageGrade = (studentId: string) => {
    const avgScore = getStudentAverageScore(studentId);
    if (avgScore >= 5) return 5;
    if (avgScore >= 4) return 4;
    if (avgScore >= 3) return 3;
    return 2;
  };

  const getGrade = (score: number) => {
    return score; // Бэкенд уже сохраняет оценку 2-5
  };

  const getPercentage = (score: number) => {
    // Конвертируем оценку 2-5 обратно в проценты для отображения
    if (score >= 5) return 100;
    if (score >= 4) return 80;
    if (score >= 3) return 60;
    return 40;
  };

  const getTestResults = (testId: string) => {
    return results.filter(r => r.testId === testId);
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
        <h1 className="text-3xl font-bold text-gray-900">Панель преподавателя</h1>
        <p className="text-gray-600 mt-2">Управляйте тестами и просматривайте результаты студентов</p>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Всего тестов</p>
              <p className="text-2xl font-bold text-gray-900">{tests.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Студентов</p>
              <p className="text-2xl font-bold text-gray-900">{students.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Завершено тестов</p>
              <p className="text-2xl font-bold text-gray-900">{results.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Plus className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Ср. балл студентов</p>
              <p className="text-2xl font-bold text-gray-900">
                {students.length > 0 
                  ? (students.reduce((sum, s) => sum + getStudentAverageGrade(s.id), 0) / students.length).toFixed(1)
                  : '0.0'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Мои тесты */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Мои тесты</h2>
          </div>
          <div className="p-6">
            {tests.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Тесты еще не созданы</p>
                <button
                  onClick={() => window.location.href = '/test-constructor'}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Создать тест
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {tests.map((test: any) => (
                  <div key={test.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-gray-900">{test.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{test.description}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {test.questions?.length || 0} вопросов
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {getTestResults(test.id).length} завершено
                      </span>
                      <div className="space-x-2">
                        <button
                          onClick={() => window.location.href = '/test-constructor'}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Редактировать
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Студенты */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Мои студенты</h2>
          </div>
          <div className="p-6">
            {students.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Студенты еще не добавлены</p>
                <p className="text-sm text-gray-400 mt-2">
                  Все студенты имеют доступ к вашим тестам
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {students.map((student: any) => (
                  <div key={student.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-gray-900">{student.name}</h3>
                        <p className="text-sm text-gray-600">{student.email}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {getStudentAverageGrade(student.id)}.0
                        </p>
                        <p className="text-xs text-gray-500">Средний балл</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Результаты тестов */}
      <div className="mt-8 bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Последние результаты</h2>
        </div>
        <div className="p-6">
          {results.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Результаты пока отсутствуют</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Студент
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Тест
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Оценка
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Успешность
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Дата
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {results.slice(0, 10).map((result: any) => (
                    <tr key={result.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {students.find(s => s.id === result.userId)?.name || 'Неизвестно'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {tests.find(t => t.id === result.testId)?.title || 'Неизвестно'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          result.score >= 5 ? 'bg-green-100 text-green-800' :
                          result.score >= 4 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {getGrade(result.score)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${
                          result.score >= 5 ? 'text-green-600' :
                          result.score >= 4 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {getPercentage(result.score)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(result.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
