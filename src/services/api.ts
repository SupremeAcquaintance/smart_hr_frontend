// src/services/api.ts
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface CoverageSuggestion {
  id: number;
  name: string;
  position: string;
  matchScore: number;
  employeeId: number;
}

interface LeaveCalendarEntry {
  id: number;
  start_date: string;
  end_date: string;
  type: string;
  status: 'approved' | 'pending' | 'rejected';
  employee_name: string;
  employee_id: number;
}


const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api',
});

// Request interceptor for auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      const auth = useAuth();
      auth.logout();
    }
    return Promise.reject(error);
  }
);

// Auth Service
export const authService = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  signup: (data: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    department_id: number;
    position: string;
    role?: string; 
  }) => api.post('/auth/signup', data),

  getProfile: () => api.get('/auth/me'),
};

// Employee Service
export const employeeService = {
  getEmployees: () => api.get('/employees'),
  getEmployee: (id: string) => api.get(`/employees/${id}`),
  updateEmployee: (id: string, data: any) => api.put(`/employees/${id}`, data),
};

// Leave Service
export const leaveService = {
  getLeaveTypes: () => api.get('/leave/types'),
  applyForLeave: (data: {
    employeeId: number;
    startDate: Date;
    endDate: Date;
    type: string;
  }) => api.post('/leave/apply', data),
  getCoverMap: (params: { start: string; end: string }) => 
    api.get('/leave/cover-map', { params }),
  calculateImpact: (data: any) => api.post('/leave/calculate-impact', data),
  approveLeave: (leaveId: string) => api.put(`/leave/approve/${leaveId}`),
  rejectLeave: (leaveId: string) => api.put(`/leave/reject/${leaveId}`),
  requestCoverage: (data: {
  requesterId: number;
  coverEmployeeId: number;
  startDate: Date;
  endDate: Date;
}) => api.post('/leave/request-coverage', data),
  getCoverageSuggestions: async (employeeId: any): Promise<CoverageSuggestion[]> => {
  const response = await api.get('/leave/coverage-suggestions', employeeId);
  return response.data;
},
getLeaveCalendar: async ({ month, year }: { month: number; year: number }): Promise<LeaveCalendarEntry[]> => {
  const response = await api.get(`/leave/calendar?month=${month}&year=${year}`);
  return response.data;
}

};

// Performance Service
export const performanceService = {
  getPerformanceData: (employeeId: number) => api.get(`/performance/${employeeId}`),
  addFeedback: (
  employeeId: number,
  feedback: { content: string; value?: number | null; type: 'feedback' | 'achievement' | 'skill' }
) => api.post(`/performance/${employeeId}/feedback`, feedback),
  getSkillData: (employeeId: number) => api.get(`/performance/${employeeId}/skills`),
  calculateImpact: async (dateRange: any) =>  api.post('/leave/calculate-impact', dateRange),
  getImpactData: (employeeId: number) => api.get(`/performance/${employeeId}/impact`),
  getCoverageSuggestions: async () => api.get('/leave/coverage-suggestions')
};

// Settings Service
export const settingsService = {
  updateProfile: (data: any) => api.put('/settings/profile', data),
  updatePassword: (data: any) => api.put('/settings/password', data),
};

export const useApi = () => {
  return api;
};