import apiClient from '../lib/apiClient';
import { Task, CreateTaskPayload, UpdateTaskPayload } from '../types';

// Fetch all tasks belonging to the authenticated user
export const fetchTasks = async (): Promise<Task[]> => {
  const { data } = await apiClient.get<Task[]>('/tasks');
  return data;
};

export const createTask = async (payload: CreateTaskPayload): Promise<Task> => {
  const { data } = await apiClient.post<Task>('/tasks', payload);
  return data;
};

export const updateTask = async (id: number, payload: UpdateTaskPayload): Promise<Task> => {
  const { data } = await apiClient.put<Task>(`/tasks/${id}`, payload);
  return data;
};

export const deleteTask = async (id: number): Promise<void> => {
  await apiClient.delete(`/tasks/${id}`);
};