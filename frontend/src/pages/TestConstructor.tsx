import { useState, useEffect } from 'react';
import { Plus, Save, Trash2, Edit } from 'lucide-react';
import { testsAPI, questionsAPI, categoriesAPI } from '../services/api';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

interface QuestionType {
  id: string;
  name: string;
  label: string;
}

export default function TestConstructor() {
  const [tests, setTests] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [test, setTest] = useState({
    title: '',
    description: '',
    categoryIds: [],
  });
  const [questions, setQuestions] = useState<any[]>([]);
  const [showTestForm, setShowTestForm] = useState(false);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [editingTest, setEditingTest] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState({
    text: '',
    order: 1,
    typeId: '',
    options: [{ text: '', isCorrect: false }],
  });
  const [questionTypes, setQuestionTypes] = useState<QuestionType[]>([]);
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);

  const { user } = useAuthStore();

  useEffect(() => {
    loadTests();
    loadCategories();
    loadQuestionTypes();
  }, []);

  const loadQuestionTypes = async () => {
    try {
      const response = await questionsAPI.getTypes();
      setQuestionTypes(response.data);
    } catch (error: any) {
      toast.error('Ошибка загрузки типов вопросов');
    }
  };

  const loadCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data);
    } catch (error: any) {
      toast.error('Ошибка загрузки категорий');
    }
  };

  const loadTests = async () => {
    try {
      const response = await testsAPI.getAll();
      setTests(response.data);
    } catch (error: any) {
      toast.error('Ошибка загрузки тестов');
    }
  };

  const loadQuestions = async (testId: string) => {
    try {
      const response = await questionsAPI.getAll();
      setQuestions(response.data.filter((q: any) => q.testId === testId));
    } catch (error: any) {
      toast.error('Ошибка загрузки вопросов');
    }
  };

  const handleSelectTest = async (testId: string) => {
    setSelectedTestId(testId);
    await loadQuestions(testId);
  };

  const handleCreateTest = async () => {
    try {
      const response = await testsAPI.create(test);
      toast.success('Тест создан успешно!');
      setTests([...tests, response.data]);
      setSelectedTestId(response.data.id);
      setTest({ title: '', description: '', categoryIds: [] });
      setShowTestForm(false);
      // Загружаем вопросы для нового теста
      await loadQuestions(response.data.id);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Ошибка создания теста');
    }
  };

  const handleCreateQuestion = async () => {
    if (!selectedTestId) {
      toast.error('Сначала создайте тест или выберите существующий');
      return;
    }

    // Проверяем, что есть правильный ответ
    const hasCorrectOption = currentQuestion.options.some(option => option.isCorrect);
    if (!hasCorrectOption) {
      toast.error('Отметьте хотя бы один правильный ответ');
      return;
    }

    // Проверяем, что все варианты заполнены
    const hasEmptyOptions = currentQuestion.options.some(option => !option.text.trim());
    if (hasEmptyOptions) {
      toast.error('Заполните все варианты ответа');
      return;
    }
    
    try {
      const singleChoiceType = questionTypes.find(t => t.name === 'SINGLE');
      if (!singleChoiceType) {
        toast.error('Тип вопроса не найден');
        return;
      }

      const questionData = {
        text: currentQuestion.text,
        order: currentQuestion.order,
        testId: selectedTestId,
        typeId: singleChoiceType.id,
        options: currentQuestion.options.filter(opt => opt.text.trim()),
      };
      console.log('Sending question data:', questionData);
      const response = await questionsAPI.create(questionData);
      toast.success('Вопрос создан успешно!');
      setQuestions([...questions, response.data]);
      setCurrentQuestion({
        text: '',
        order: questions.length + 1,
        typeId: '',
        options: [{ text: '', isCorrect: false }],
      });
      setShowQuestionForm(false);
      // Перезагружаем вопросы для теста
      await loadQuestions(selectedTestId);
    } catch (error: any) {
      console.error('Error creating question:', error.response?.data);
      toast.error(error.response?.data?.message || 'Ошибка создания вопроса');
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    try {
      await questionsAPI.delete(questionId);
      toast.success('Вопрос удален успешно!');
      setQuestions(questions.filter(q => q.id !== questionId));
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Ошибка удаления вопроса');
    }
  };

  const handleDeleteTest = async (testId: string) => {
    try {
      await testsAPI.delete(testId);
      toast.success('Тест удален успешно!');
      setTests(tests.filter(t => t.id !== testId));
      if (selectedTestId === testId) {
        setSelectedTestId(null);
        setQuestions([]);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Ошибка удаления теста');
    }
  };

  const handleSaveTest = async () => {
    if (!editingTest) return;
    
    try {
      await testsAPI.update(editingTest.id, test);
      toast.success('Тест обновлен успешно!');
      setTests(tests.map(t => t.id === editingTest.id ? { ...t, ...test } : t));
      setEditingTest(null);
      setTest({ title: '', description: '', categoryIds: [] });
      setShowTestForm(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Ошибка обновления теста');
    }
  };

  const addOption = () => {
    if (currentQuestion.options.length >= 4) {
      toast.error('Максимум 4 варианта ответа');
      return;
    }
    setCurrentQuestion({
      ...currentQuestion,
      options: [...currentQuestion.options, { text: '', isCorrect: false }],
    });
  };

  const removeOption = (index: number) => {
    setCurrentQuestion({
      ...currentQuestion,
      options: currentQuestion.options.filter((_, i) => i !== index),
    });
  };

  const updateOption = (index: number, field: 'text' | 'isCorrect', value: string | boolean) => {
    setCurrentQuestion({
      ...currentQuestion,
      options: currentQuestion.options.map((option, i) => 
        i === index ? { ...option, [field]: value } : option
      ),
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Конструктор тестов</h2>
        </div>

        <div className="px-6 py-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-900">Мои тесты</h3>
            <button
              onClick={() => setShowTestForm(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Новый тест
            </button>
          </div>

          {tests.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>Тесты еще не созданы</p>
              <p>Создайте тест, затем добавляйте вопросы</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tests.map((test: any) => (
                <div key={test.id} className={`border rounded-lg p-4 cursor-pointer ${
                  selectedTestId === test.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
                }`}
                  onClick={() => handleSelectTest(test.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{test.title}</h4>
                      <p className="text-gray-700 mt-1">{test.description}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setTest({
                            title: test.title,
                            description: test.description,
                            categoryIds: test.categories?.map((c: any) => c.id) || [],
                          });
                          setEditingTest(test);
                          setSelectedTestId(test.id);
                          setShowTestForm(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Редактировать
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTest(test.id);
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                        Удалить
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {questions.filter((q: any) => q.testId === test.id).length} / 10 вопросов
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {showTestForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-screen overflow-y-auto">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingTest ? 'Редактирование теста' : 'Создание нового теста'}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Название теста
                  </label>
                  <input
                    type="text"
                    value={test.title}
                    onChange={(e) => setTest({ ...test, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Введите название теста"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Описание теста
                  </label>
                  <textarea
                    value={test.description}
                    onChange={(e) => setTest({ ...test, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Введите описание теста"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Категории
                  </label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {categories.map((category) => (
                      <label key={category.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={test.categoryIds.includes(category.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setTest({ ...test, categoryIds: [...test.categoryIds, category.id] });
                            } else {
                              setTest({ ...test, categoryIds: test.categoryIds.filter(id => id !== category.id) });
                            }
                          }}
                          className="mr-2"
                        />
                        <span className="text-sm">{category.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={editingTest ? handleSaveTest : handleCreateTest}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {editingTest ? 'Сохранить' : 'Создать'}
                  </button>
                  <button
                    onClick={() => {
                      setShowTestForm(false);
                      setEditingTest(null);
                      setTest({ title: '', description: '', categoryIds: [] });
                    }}
                    className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="px-6 py-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              {selectedTestId ? `Вопросы теста: ${tests.find(t => t.id === selectedTestId)?.title}` : 'Вопросы теста'}
            </h3>
            <button
              onClick={() => {
                if (!selectedTestId) {
                  toast.error('Сначала выберите тест');
                  return;
                }
                setShowQuestionForm(true);
              }}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Добавить вопрос
            </button>
          </div>

          {!selectedTestId ? (
            <div className="text-center py-12 text-gray-500">
              <p>Выберите тест для просмотра и добавления вопросов</p>
            </div>
          ) : (
            <div>
              {questions.filter((q: any) => q.testId === selectedTestId).length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p>У этого теста еще нет вопросов</p>
                  <p>Нажмите "Добавить вопрос" чтобы создать первый вопрос</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {questions
                    .filter((q: any) => q.testId === selectedTestId)
                    .map((question: any, index) => (
                    <div key={question.id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900">Вопрос {index + 1}</h4>
                          <p className="text-gray-700 mt-1">{question.text}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteQuestion(question.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-2">
                        {question.options.map((option: any, optionIndex: number) => (
                          <div key={optionIndex} className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded text-sm ${
                              option.isCorrect ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {option.text}
                              {option.isCorrect && ' ✓'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {showQuestionForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-screen overflow-y-auto">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingQuestion ? 'Редактирование вопроса' : 'Создание нового вопроса'}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Текст вопроса
                  </label>
                  <textarea
                    value={currentQuestion.text}
                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, text: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Введите текст вопроса"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Порядковый номер
                  </label>
                  <input
                    type="number"
                    value={currentQuestion.order}
                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, order: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    min="1"
                    max="10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Варианты ответа
                  </label>
                  <div className="space-y-2">
                    {currentQuestion.options.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={option.text}
                          onChange={(e) => updateOption(index, 'text', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder={`Вариант ${index + 1}`}
                        />
                        <input
                          type="checkbox"
                          checked={option.isCorrect}
                          onChange={(e) => updateOption(index, 'isCorrect', e.target.checked)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <button
                          type="button"
                          onClick={() => removeOption(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => addOption()}
                    className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Добавить вариант
                  </button>
                  <button
                    onClick={handleCreateQuestion}
                    className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Сохранить и продолжить
                  </button>
                  <button
                    onClick={() => {
                      setShowQuestionForm(false);
                      setCurrentQuestion({
                        text: '',
                        order: questions.length + 1,
                        typeId: '',
                        options: [{ text: '', isCorrect: false }],
                      });
                      setEditingQuestion(null);
                    }}
                    className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
