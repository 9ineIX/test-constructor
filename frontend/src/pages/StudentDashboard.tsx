import { useState, useEffect } from 'react';
import { Play, CheckCircle, Clock, TrendingUp, BookOpen } from 'lucide-react';
import { testsAPI, resultsAPI } from '../services/api';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export default function StudentDashboard() {
  const [availableTests, setAvailableTests] = useState([]);
  const [completedTests, setCompletedTests] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [availableRes, resultsRes] = await Promise.all([
        testsAPI.getAll(),
        resultsAPI.getAll()
      ]);
      
      // Фильтруем доступные тесты (те, что не пройдены студентом)
      const allTests = availableRes.data;
      const completedTestIds = resultsRes.data.map((r: any) => r.testId);
      const available = allTests.filter((test: any) => !completedTestIds.includes(test.id));
      const completed = allTests.filter((test: any) => completedTestIds.includes(test.id));
      
      setAvailableTests(available);
      setCompletedTests(completed);
      setResults(resultsRes.data);
    } catch (error) {
      toast.error('Ошибка загрузки данных');
    } finally {
      setLoading(false);
    }
  };

  const getTestResult = (testId: string) => {
    return results.find(r => r.testId === testId);
  };

  const getScoreColor = (score: number) => {
    if (score >= 5) return 'text-green-600';
    if (score >= 4) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGrade = (score: number) => {
    return score; // Бэкенд уже сохраняет оценку 2-5
  };

  const getPercentage = (result: any, test: any) => {
    // Calculate actual percentage based on correct answers
    if (!result || !test || !test.questions || test.questions.length === 0) {
      return 0;
    }

    const totalQuestions = test.questions.length;
    let correctAnswers = 0;

    for (const question of test.questions) {
      const userAnswer = result.answers?.[question.id];
      if (!userAnswer) continue;

      const correctOptions = question.options?.filter((opt: any) => opt.isCorrect) || [];
      
      if (question.type?.name === 'SINGLE') {
        const selectedOption = question.options?.find((opt: any) => opt.id === userAnswer[0]);
        if (selectedOption?.isCorrect) {
          correctAnswers++;
        }
      } else if (question.type?.name === 'MULTIPLE') {
        const userSelectedOptions = Array.isArray(userAnswer) ? userAnswer : [userAnswer];
        const correctOptionIds = correctOptions.map((opt: any) => opt.id);
        
        if (userSelectedOptions.length === correctOptionIds.length &&
            userSelectedOptions.every((id: string) => correctOptionIds.includes(id))) {
          correctAnswers++;
        }
      } else if (question.type?.name === 'TEXT') {
        if (typeof userAnswer === 'string' && correctOptions.length > 0) {
          const normalizedUserAnswer = userAnswer.trim().toLowerCase();
          const normalizedCorrectAnswer = correctOptions[0].text.trim().toLowerCase();
          if (normalizedUserAnswer === normalizedCorrectAnswer) {
            correctAnswers++;
          }
        }
      }
    }

    return Math.round((correctAnswers / totalQuestions) * 100);
  };

  const startTest = (testId: string) => {
    window.location.href = `/test-taking/${testId}`;
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
        <h1 className="text-3xl font-bold text-gray-900">Панель студента</h1>
        <p className="text-gray-600 mt-2">Просматривайте доступные тесты и ваши результаты</p>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Доступно тестов</p>
              <p className="text-2xl font-bold text-gray-900">{availableTests.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Завершено</p>
              <p className="text-2xl font-bold text-gray-900">{completedTests.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Успешность</p>
              <p className="text-2xl font-bold text-gray-900">
                {results.length > 0 
                  ? (() => {
                      const totalPercentage = results.reduce((sum: number, r: any) => {
                        const test = completedTests.find((t: any) => t.id === r.testId);
                        return sum + getPercentage(r, test);
                      }, 0);
                      return Math.round(totalPercentage / results.length);
                    })()
                  : 0}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Средняя оценка</p>
              <p className="text-2xl font-bold text-gray-900">
                {results.length > 0 
                  ? (results.reduce((sum, r) => sum + r.score, 0) / results.length).toFixed(1)
                  : '-'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Доступные тесты */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Доступные тесты</h2>
          </div>
          <div className="p-6">
            {availableTests.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Нет доступных тестов</p>
                <p className="text-sm text-gray-400 mt-2">
                  Преподаватели еще не назначили тесты
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {availableTests.map((test: any) => (
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
                        {test.author?.name || 'Преподаватель'}
                      </span>
                      <button
                        onClick={() => startTest(test.id)}
                        className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Начать
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Завершенные тесты */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Завершенные тесты</h2>
          </div>
          <div className="p-6">
            {completedTests.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Нет завершенных тестов</p>
                <p className="text-sm text-gray-400 mt-2">
                  Начните тест из доступных, чтобы увидеть результаты
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {completedTests.map((test: any) => {
                  const result = getTestResult(test.id);
                  return (
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
                        <div className="text-right">
                          <p className={`text-lg font-bold ${getScoreColor(result?.score || 0)}`}>
                            {getGrade(result?.score || 0)}
                          </p>
                          <p className="text-xs text-gray-500">
                            Успешность: {getPercentage(result, test)}%
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">
                            {result ? new Date(result.createdAt).toLocaleDateString() : ''}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* История результатов */}
      <div className="mt-8 bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">История результатов</h2>
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
                      Тест
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Преподаватель
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
                  {results.map((result: any) => {
                    const test = completedTests.find(t => t.id === result.testId);
                    return (
                      <tr key={result.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {test?.title || 'Неизвестно'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {test?.author?.name || 'Преподаватель'}
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
                          <span className={`text-sm font-medium ${getScoreColor(result.score)}`}>
                            {getPercentage(result, test)}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(result.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
