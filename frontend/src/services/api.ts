import axios from 'axios';
import type {
  Employee, Team, ShiftType, ShiftRule, ShiftPlan, ShiftAssignment, Absence
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Token ${token}`;
    }
    return config;
});

export const AuthService = {
    login: async (username: string, password: string) => {
        const response = await api.post<{token: string}>('/api-token-auth/', { username, password });
        return response.data;
    }
};

export const EmployeeService = {
  getAll: async () => (await api.get<Employee[]>('/employees/')).data,
  get: async (id: string) => (await api.get<Employee>(`/employees/${id}/`)).data,
  create: async (data: Partial<Employee>) => (await api.post<Employee>('/employees/', data)).data,
  update: async (id: string, data: Partial<Employee>) => (await api.patch<Employee>(`/employees/${id}/`, data)).data,
  delete: async (id: string) => (await api.delete(`/employees/${id}/`)).data,
};

export const TeamService = {
  getAll: async () => (await api.get<Team[]>('/teams/')).data,
  get: async (id: string) => (await api.get<Team>(`/teams/${id}/`)).data,
  create: async (data: Partial<Team>) => (await api.post<Team>('/teams/', data)).data,
  update: async (id: string, data: Partial<Team>) => (await api.patch<Team>(`/teams/${id}/`, data)).data,
  delete: async (id: string) => (await api.delete(`/teams/${id}/`)).data,
};

export const ShiftTypeService = {
  getAll: async () => (await api.get<ShiftType[]>('/shift-types/')).data,
  get: async (id: string) => (await api.get<ShiftType>(`/shift-types/${id}/`)).data,
  create: async (data: Partial<ShiftType>) => (await api.post<ShiftType>('/shift-types/', data)).data,
  update: async (id: string, data: Partial<ShiftType>) => (await api.patch<ShiftType>(`/shift-types/${id}/`, data)).data,
  delete: async (id: string) => (await api.delete(`/shift-types/${id}/`)).data,
};

export const ShiftRuleService = {
  getAll: async () => (await api.get<ShiftRule[]>('/shift-rules/')).data,
  get: async (id: string) => (await api.get<ShiftRule>(`/shift-rules/${id}/`)).data,
  create: async (data: Partial<ShiftRule>) => (await api.post<ShiftRule>('/shift-rules/', data)).data,
  update: async (id: string, data: Partial<ShiftRule>) => (await api.patch<ShiftRule>(`/shift-rules/${id}/`, data)).data,
  delete: async (id: string) => (await api.delete(`/shift-rules/${id}/`)).data,
};

export const ShiftPlanService = {
  getAll: async () => (await api.get<ShiftPlan[]>('/shift-plans/')).data,
  get: async (id: string) => (await api.get<ShiftPlan>(`/shift-plans/${id}/`)).data,
  create: async (data: Partial<ShiftPlan>) => (await api.post<ShiftPlan>('/shift-plans/', data)).data,
  update: async (id: string, data: Partial<ShiftPlan>) => (await api.patch<ShiftPlan>(`/shift-plans/${id}/`, data)).data,
  delete: async (id: string) => (await api.delete(`/shift-plans/${id}/`)).data,
  autoSchedule: async (id: string) => (await api.post(`/shift-plans/${id}/auto_schedule/`)).data,
};

export const ShiftAssignmentService = {
  getAll: async () => (await api.get<ShiftAssignment[]>('/shift-assignments/')).data,
  get: async (id: string) => (await api.get<ShiftAssignment>(`/shift-assignments/${id}/`)).data,
  create: async (data: Partial<ShiftAssignment>) => (await api.post<ShiftAssignment>('/shift-assignments/', data)).data,
  update: async (id: string, data: Partial<ShiftAssignment>) => (await api.patch<ShiftAssignment>(`/shift-assignments/${id}/`, data)).data,
  delete: async (id: string) => (await api.delete(`/shift-assignments/${id}/`)).data,
};

export const AbsenceService = {
  getAll: async () => (await api.get<Absence[]>('/absences/')).data,
  get: async (id: string) => (await api.get<Absence>(`/absences/${id}/`)).data,
  create: async (data: Partial<Absence>) => (await api.post<Absence>('/absences/', data)).data,
  update: async (id: string, data: Partial<Absence>) => (await api.patch<Absence>(`/absences/${id}/`, data)).data,
  delete: async (id: string) => (await api.delete(`/absences/${id}/`)).data,
};
