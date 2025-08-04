"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Employee, Team } from '@/lib/types';
import { employeeManager, teamManager } from '@/lib/dataManager';

// Define the shape of the context data.
interface AppDataContextType {
  employees: Employee[];
  teams: Team[];
  loading: boolean;
  addEmployee: (employeeData: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, updates: Partial<Omit<Employee, 'id'>>) => void;
  deleteEmployee: (id: string) => void;
  addTeam: (teamData: Omit<Team, 'id'>) => void;
  updateTeam: (id: string, updates: Partial<Omit<Team, 'id'>>) => void;
  deleteTeam: (id: string) => void;
}

// Create the context with a default undefined value.
const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

// Define the props for the provider component.
interface DataProviderProps {
  children: ReactNode;
}

/**
 * The DataProvider component is responsible for fetching, holding, and
 * managing the application's state, providing it to all child components.
 */
export const DataProvider = ({ children }: DataProviderProps) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  // Load initial data from localStorage on the client side.
  useEffect(() => {
    setEmployees(employeeManager.getAll());
    setTeams(teamManager.getAll());
    setLoading(false);
  }, []);

  // --- Employee Management ---
  const addEmployee = (employeeData: Omit<Employee, 'id'>) => {
    const newEmployee = employeeManager.create(employeeData);
    setEmployees(prev => [...prev, newEmployee]);
  };

  const updateEmployee = (id: string, updates: Partial<Omit<Employee, 'id'>>) => {
    const updatedEmployee = employeeManager.update(id, updates);
    if (updatedEmployee) {
      setEmployees(prev => prev.map(emp => emp.id === id ? updatedEmployee : emp));
    }
  };

  const deleteEmployee = (id: string) => {
    const success = employeeManager.delete(id);
    if (success) {
      setEmployees(prev => prev.filter(emp => emp.id !== id));
    }
  };

  // --- Team Management ---
  const addTeam = (teamData: Omit<Team, 'id'>) => {
    const newTeam = teamManager.create(teamData);
    setTeams(prev => [...prev, newTeam]);
  };

  const updateTeam = (id: string, updates: Partial<Omit<Team, 'id'>>) => {
    const updatedTeam = teamManager.update(id, updates);
    if (updatedTeam) {
      setTeams(prev => prev.map(team => team.id === id ? updatedTeam : team));
    }
  };

  const deleteTeam = (id: string) => {
    const success = teamManager.delete(id);
    if (success) {
      setTeams(prev => prev.filter(team => team.id !== id));
    }
  };

  const value = {
    employees,
    teams,
    loading,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    addTeam,
    updateTeam,
    deleteTeam,
  };

  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  );
};

/**
 * Custom hook to easily access the application data context.
 * Throws an error if used outside of a DataProvider.
 */
export const useAppData = () => {
  const context = useContext(AppDataContext);
  if (context === undefined) {
    throw new Error('useAppData must be used within a DataProvider');
  }
  return context;
};
