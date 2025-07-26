// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupForm';
import DashboardPage from './pages/DashboardPage';
import EmployeesPage from './pages/EmployeesPage';
import LeavePage from './pages/LeavePage';
import PerformancePage from './pages/Performance';
import SettingsPage from './pages/Settings';
import NotFoundPage from './pages/NotFoundPage';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/ui/ScrollToTop';
import PrivateRoute from './components/auth/PrivateRoute';
import NotificationContainer from './components/ui/NotificationContainer';
import { GlobalStyles } from './styles/GlobalStyles';
import './App.css';
import './styles/variables.css';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <GlobalStyles />

            <main className="main-content">
              <Header />
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} /> {/* ✅ */}

                  {/* Protected Routes */}
                  <Route element={<PrivateRoute />}>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/employees" element={<EmployeesPage />} />
                    <Route path="/leave" element={<LeavePage />} />
                    <Route path="/performance" element={<PerformancePage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                  </Route>

                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </AnimatePresence>
              <Footer />
            </main>

            <ScrollToTop />
            <NotificationContainer />
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;