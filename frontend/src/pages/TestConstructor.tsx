import { useState, useEffect } from 'react';
import { Plus, Save, Trash2, Edit } from 'lucide-react';
import { testsAPI, questionsAPI, categoriesAPI } from '../services/api';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

interface QuestionType {
  id: string;
  name: string;
  label: string;
}

const testSchema = z.object({
  title: z.string().min(3, 'Название теста должно содержать минимум 3 символа'),
  description: z.string().optional(),
  categoryIds: z.array(z.string()).min(1, 'Выберите хотя бы одну категорию'),
});

type TestFormData = z.infer<typeof testSchema>;

const questionSchema = z.object({
  text: z.string().min(5, 'Текст вопроса должен содержать минимум 5 символов'),
});

type QuestionFormData = z.infer<typeof questionSchema>;

export default function TestConstructor() {
  const [tests, setTests] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [showTestForm, setShowTestForm] = useState(false);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [editingTest, setEditingTest] = useState<any>(null);
  const [editingQuestion, setEditingQuestion] = useState<any>(null);
  const [currentQuestion, setCurrentQuestion] = useState({
    text: '',
    order: 1,
    typeId: '',
    options: [{ text: '', isCorrect: false }],
  });
  const [questionTypes, setQuestionTypes] = useState<QuestionType[]>([]);
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);

  const {
    register: registerTest,
    handleSubmit: handleSubmitTest,
    formState: { errors: testErrors },
    reset: resetTest,
    watch,
    setValue: setTestValue,
  } = useForm<TestFormData>({
    resolver: zodResolver(testSchema),
    defaultValues: {
      title: '',
      description: '',
      categoryIds: [],
    },
  });

  const selectedCategoryIds = watch('categoryIds') || [];

  const {
    register: registerQuestion,
    handleSubmit: handleSubmitQuestion,
    formState: { errors: questionErrors },
    reset: resetQuestion,
  } = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      text: '',
    },
  });

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

  const handleCreateTest = async (data: TestFormData) => {
    try {
      const response = await testsAPI.create(data);
      toast.success('Тест создан успешно!');
      setTests([...tests, response.data]);
      setSelectedTestId(response.data.id);
      resetTest();
      setShowTestForm(false);
      // Загружаем вопросы для нового теста
      await loadQuestions(response.data.id);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Ошибка создания теста');
    }
  };

  const handleCreateQuestion = async (data: QuestionFormData) => {
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

    // Проверяем минимум 2 варианта
    if (currentQuestion.options.length < 2) {
      toast.error('Минимум 2 варианта ответа');
      return;
    }

    try {
      const singleChoiceType = questionTypes.find(t => t.name === 'SINGLE');
      if (!singleChoiceType) {
        toast.error('Тип вопроса не найден');
        return;
      }

      // Вычисляем следующий order на основе текущего количества вопросов
      const nextOrder = questions.filter((q: any) => q.testId === selectedTestId).length + 1;

      const questionData = {
        text: data.text,
        order: nextOrder,
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
        order: nextOrder + 1,
        typeId: '',
        options: [{ text: '', isCorrect: false }],
      });
      resetQuestion();
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

  const handleSaveTest = async (data: TestFormData) => {
    if (!editingTest) return;

    try {
      await testsAPI.update(editingTest.id, data);
      toast.success('Тест обновлен успешно!');
      setTests(tests.map((t: any) => t.id === editingTest.id ? { ...t, ...data } : t));
      setEditingTest(null);
      resetTest();
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
              {tests.map((testItem: any) => (
                <div key={testItem.id} className={`border rounded-lg p-4 cursor-pointer ${
                  selectedTestId === testItem.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
                }`}
                  onClick={() => handleSelectTest(testItem.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{testItem.title}</h4>
                      <p className="text-gray-700 mt-1">{testItem.description}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          resetTest({
                            title: testItem.title,
                            description: testItem.description || '',
                            categoryIds: testItem.categories?.map((c: any) => c.id) || [],
                          });
                          setEditingTest(testItem);
                          setSelectedTestId(testItem.id);
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
                          handleDeleteTest(testItem.id);
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
                      {questions.filter((q: any) => q.testId === testItem.id).length} / 10 вопросов
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

              <form onSubmit={editingTest ? handleSubmitTest(handleSaveTest) : handleSubmitTest(handleCreateTest)}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Название теста
                    </label>
                    <input
                      {...registerTest('title')}
                      type="text"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                        testErrors.title ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Введите название теста"
                    />
                    {testErrors.title && (
                      <p className="mt-1 text-sm text-red-600">{testErrors.title.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Описание теста
                    </label>
                    <textarea
                      {...registerTest('description')}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Введите описание теста"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Категории
                    </label>
                    <div className={`space-y-2 max-h-32 overflow-y-auto p-2 border rounded-md ${
                      testErrors.categoryIds ? 'border-red-500' : 'border-gray-300'
                    }`}>
                      {categories.map((category: any) => (
                        <label key={category.id} className="flex items-center">
                          <input
                            type="checkbox"
                            value={category.id}
                            checked={selectedCategoryIds.includes(category.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setTestValue('categoryIds', [...selectedCategoryIds, category.id]);
                              } else {
                                setTestValue('categoryIds', selectedCategoryIds.filter((id: string) => id !== category.id));
                              }
                            }}
                            className="mr-2"
                          />
                          <span className="text-sm">{category.name}</span>
                        </label>
                      ))}
                    </div>
                    {testErrors.categoryIds && (
                      <p className="mt-1 text-sm text-red-600">{testErrors.categoryIds.message}</p>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {editingTest ? 'Сохранить' : 'Создать'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowTestForm(false);
                        setEditingTest(null);
                        resetTest();
                      }}
                      className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              </form>
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

              <form onSubmit={handleSubmitQuestion(handleCreateQuestion)}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Текст вопроса
                    </label>
                    <textarea
                      {...registerQuestion('text')}
                      rows={3}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                        questionErrors.text ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Введите текст вопроса"
                    />
                    {questionErrors.text && (
                      <p className="mt-1 text-sm text-red-600">{questionErrors.text.message}</p>
                    )}
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
                            className={`flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                              !option.text.trim() ? 'border-red-500' : 'border-gray-300'
                            }`}
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
                    {currentQuestion.options.length < 2 && (
                      <p className="mt-1 text-sm text-red-600">Минимум 2 варианта ответа</p>
                    )}
                    {currentQuestion.options.length > 4 && (
                      <p className="mt-1 text-sm text-red-600">Максимум 4 варианта ответа</p>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => addOption()}
                      className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Добавить вариант
                    </button>
                    <button
                      type="submit"
                      className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Сохранить
                    </button>
                    <button
                      type="button"
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
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
