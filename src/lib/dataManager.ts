import type { Employee, Team, ShiftType, ShiftPlan, Absence, ShiftRule } from './types';

/**
 * A generic class to manage a collection of items in localStorage.
 * It provides CRUD operations and handles JSON serialization.
 * @template T - The type of items in the collection, must have an 'id' property.
 */
class StorageCollection<T extends { id: string }> {
  private key: string;

  constructor(key: string) {
    this.key = key;
  }

  /**
   * Reads all items from localStorage.
   * @returns An array of items, or an empty array if data is not present or an error occurs.
   */
  private read(): T[] {
    if (typeof window === 'undefined') {
      return [];
    }
    try {
      const data = localStorage.getItem(this.key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error(`Error reading from localStorage key "${this.key}":`, error);
      return [];
    }
  }

  /**
   * Writes an array of items to localStorage.
   * @param data - The array of items to write.
   */
  private write(data: T[]): void {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      localStorage.setItem(this.key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error writing to localStorage key "${this.key}":`, error);
    }
  }

  /**
   * Retrieves all items from the collection.
   */
  getAll(): T[] {
    return this.read();
  }

  /**
   * Retrieves a single item by its ID.
   */
  getById(id: string): T | undefined {
    return this.read().find(item => item.id === id);
  }

  /**
   * Creates a new item and adds it to the collection.
   * A unique ID is generated automatically.
   */
  create(itemData: Omit<T, 'id'>): T {
    const items = this.read();
    const newItem = { ...itemData, id: crypto.randomUUID() } as T;
    items.push(newItem);
    this.write(items);
    return newItem;
  }

  /**
   * Updates an existing item in the collection.
   */
  update(id: string, updates: Partial<Omit<T, 'id'>>): T | null {
    const items = this.read();
    const index = items.findIndex(item => item.id === id);
    if (index === -1) {
      return null;
    }
    const updatedItem = { ...items[index], ...updates };
    items[index] = updatedItem;
    this.write(items);
    return updatedItem;
  }

  /**
   * Deletes an item from the collection by its ID.
   */
  delete(id: string): boolean {
    const items = this.read();
    const newItems = items.filter(item => item.id !== id);
    if (items.length === newItems.length) {
      return false; // Item not found
    }
    this.write(newItems);
    return true;
  }

  /**
   * Replaces all items in the collection with a new set of items.
   * This is useful for data import operations.
   */
  replaceAll(items: T[]): void {
    if (Array.isArray(items) && items.every(item => typeof item === 'object' && item !== null && 'id' in item)) {
      this.write(items);
    } else {
      console.error(`Invalid data provided for key "${this.key}". Data was not replaced.`);
    }
  }
}

// Define the keys for storing data in localStorage.
const STORAGE_KEYS = {
  employees: 'codex-shift-planner-employees',
  teams: 'codex-shift-planner-teams',
  shiftTypes: 'codex-shift-planner-shift-types',
  shiftPlans: 'codex-shift-planner-shift-plans',
  absences: 'codex-shift-planner-absences',
  shiftRules: 'codex-shift-planner-shift-rules',
};

// Create and export a manager instance for each data type.
export const employeeManager = new StorageCollection<Employee>(STORAGE_KEYS.employees);
export const teamManager = new StorageCollection<Team>(STORAGE_KEYS.teams);
export const shiftTypeManager = new StorageCollection<ShiftType>(STORAGE_KEYS.shiftTypes);
export const shiftPlanManager = new StorageCollection<ShiftPlan>(STORAGE_KEYS.shiftPlans);
export const absenceManager = new StorageCollection<Absence>(STORAGE_KEYS.absences);
export const shiftRuleManager = new StorageCollection<ShiftRule>(STORAGE_KEYS.shiftRules);

/**
 * Exports all application data to a single JSON file.
 */
export function exportAllData() {
  if (typeof window === 'undefined') return;

  const allData = {
    employees: employeeManager.getAll(),
    teams: teamManager.getAll(),
    shiftTypes: shiftTypeManager.getAll(),
    shiftPlans: shiftPlanManager.getAll(),
    absences: absenceManager.getAll(),
    shiftRules: shiftRuleManager.getAll(),
    exportDate: new Date().toISOString(),
  };

  const dataStr = JSON.stringify(allData, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `codex-shift-planner-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Imports data from a JSON string and overwrites existing data.
 */
export function importAllData(jsonString: string): { success: boolean; message: string } {
  try {
    const data = JSON.parse(jsonString);

    if (!data || typeof data !== 'object') {
      return { success: false, message: 'Invalid JSON format.' };
    }

    if (data.employees) employeeManager.replaceAll(data.employees);
    if (data.teams) teamManager.replaceAll(data.teams);
    if (data.shiftTypes) shiftTypeManager.replaceAll(data.shiftTypes);
    if (data.shiftPlans) shiftPlanManager.replaceAll(data.shiftPlans);
    if (data.absences) absenceManager.replaceAll(data.absences);
    if (data.shiftRules) shiftRuleManager.replaceAll(data.shiftRules);

    return { success: true, message: 'Data imported successfully. Please refresh the page to see the changes.' };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, message: `Failed to import data: ${message}` };
  }
}
