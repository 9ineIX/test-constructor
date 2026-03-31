import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { testsAPI, questionsAPI, resultsAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function TestTaking() {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  
  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [testStarted, setTestStarted] = useState(false);

  useEffect(() => {
    if (testId) {
      loadTestData();
    }
  }, [testId]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (testStarted && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && testStarted) {
      handleSubmitTest();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, testStarted]);

  const loadTestData = async () => {
    try {
      const [testRes, questionsRes] = await Promise.all([
        testsAPI.getById(testId!),
        questionsAPI.getAll(testId!)
      ]);
      
      setTest(testRes.data);
      setQuestions(questionsRes.data.sort((a: any, b: any) => a.order - b.order));
      
      // Устанавливаем время на тест (30 минут на вопрос)
      setTimeLeft(questionsRes.data.length * 30 * 60);
    } catch (error) {
      toast.error('Ошибка загрузки теста');
      navigate('/student-dashboard');
    } finally {
      setLoading(false);
    }
  };

  const startTest = () => {
    setTestStarted(true);
  };

  const handleAnswerChange = (questionId: string, answer: string | string[]) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitTest = async () => {
    if (submitting) return;
    
    setSubmitting(true);
    
    try {
      const resultData = {
        testId: testId!,
        answers: answers
      };
      console.log('Submitting result:', resultData);
      await resultsAPI.create(resultData);
      
      toast.success('Тест завершен! Результат сохранен.');
      navigate('/student-dashboard');
    } catch (error) {
      console.error('Error submitting result:', error);
      toast.error('Ошибка сохранения результатов');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!testStarted) {
    return (
      <div className="max-w-4xl mx-auto py-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{test.title}</h1>
            <p className="text-gray-600 mb-8">{test.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-blue-600 mr-3" />
                  <div className="text-left">
                    <p className="text-sm text-gray-600">Вопросов</p>
                    <p className="text-xl font-bold text-gray-900">{questions.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center justify-center">
                  <Clock className="w-8 h-8 text-green-600 mr-3" />
                  <div className="text-left">
                    <p className="text-sm text-gray-600">Время</p>
                    <p className="text-xl font-bold text-gray-900">{Math.round(questions.length * 30)} мин</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-purple-600 mr-3" />
                  <div className="text-left">
                    <p className="text-sm text-gray-600">Автор</p>
                    <p className="text-xl font-bold text-gray-900">{test.author?.name || 'Преподаватель'}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <button
              onClick={startTest}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Начать тест
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6">
      {/* Прогресс и таймер */}
      <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <span className="text-sm text-gray-600 mr-2">Вопрос {currentQuestionIndex + 1} из {questions.length}</span>
            <div className="w-64 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <Clock className="w-4 h-4 mr-1" />
            <span className={timeLeft < 300 ? 'text-red-600 font-bold' : 'text-gray-600'}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      </div>

      {/* Вопрос */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {currentQuestion.text}
          </h2>
          
          {currentQuestion.typeId === '25fa814d-4523-4c59-b1b3-8d72bd768b28' ? (
            // SINGLE_CHOICE
            <div className="space-y-3">
              {currentQuestion.options.map((option: any, index: number) => (
                <label key={index} className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name={`question-${currentQuestion.id}`}
                    value={option.id}
                    checked={answers[currentQuestion.id] === option.id}
                    onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                    className="mr-3"
                  />
                  <span className="text-gray-900">{option.text}</span>
                </label>
              ))}
            </div>
          ) : (
            // MULTIPLE_CHOICE
            <div className="space-y-3">
              {currentQuestion.options.map((option: any, index: number) => (
                <label key={index} className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    value={option.id}
                    checked={Array.isArray(answers[currentQuestion.id]) && 
                           answers[currentQuestion.id].includes(option.id)}
                    onChange={(e) => {
                      const currentAnswers = answers[currentQuestion.id] || [];
                      if (e.target.checked) {
                        handleAnswerChange(currentQuestion.id, [...currentAnswers, option.id]);
                      } else {
                        handleAnswerChange(currentQuestion.id, currentAnswers.filter((ans: string) => ans !== option.id));
                      }
                    }}
                    className="mr-3"
                  />
                  <span className="text-gray-900">{option.text}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Навигация */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevQuestion}
            disabled={currentQuestionIndex === 0}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Предыдущий
          </button>
          
          <div className="flex space-x-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-8 h-8 rounded-full text-sm ${
                  index === currentQuestionIndex
                    ? 'bg-blue-600 text-white'
                    : answers[questions[index].id]
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          
          {currentQuestionIndex === questions.length - 1 ? (
            <button
              onClick={handleSubmitTest}
              disabled={submitting}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Загрузка...' : 'Завершить тест'}
              <CheckCircle className="w-4 h-4 ml-2" />
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Следующий
              <ChevronRight className="w-4 h-4 ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
