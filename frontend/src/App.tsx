import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useEffect } from 'react';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import TestConstructor from './pages/TestConstructor';
import TestTaking from './pages/TestTaking';
import TestResults from './pages/TestResults';
import { Toaster } from 'react-hot-toast';
import './index.css';

function App() {
  const { isAuthenticated, user, setAuth } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem('auth-storage');
    if (token) {
      try {
        const authData = JSON.parse(token);
        if (authData.state?.isAuthenticated) {
          setAuth(authData.state.user, authData.state.accessToken, authData.state.refreshToken);
        }
      } catch (error) {
        localStorage.removeItem('auth-storage');
      }
    }
  }, [setAuth]);

  if (!isAuthenticated) {
    return (
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    );
  }

  const getDashboardComponent = () => {
    switch (user?.role) {
      case 'TEACHER':
        return <TeacherDashboard />;
      case 'STUDENT':
        return <StudentDashboard />;
      case 'ADMIN':
        return <AdminDashboard />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <Router>
      <Toaster position="top-right" />
      <Layout>
        <Routes>
          <Route path="/" element={getDashboardComponent()} />
          <Route path="/dashboard" element={getDashboardComponent()} />
          <Route path="/teacher" element={<TeacherDashboard />} />
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/test-constructor" element={<TestConstructor />} />
          <Route path="/test-taking/:testId" element={<TestTaking />} />
          <Route path="/test-results/:testId" element={<TestResults />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
