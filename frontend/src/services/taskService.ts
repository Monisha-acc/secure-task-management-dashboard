// Service functions for task CRUD API calls
// All requests are automatically authenticated via apiClient interceptor

import apiClient from '../lib/apiClient';
import { Task, CreateTaskPayload, UpdateTaskPayload } from '../types';

// Fetch all tasks belonging to the authenticated user
export const fetchTasks = async (): Promise<Task[]> => {
  const { data } = await apiClient.get<Task[]>('/tasks');
  return data;
};

// Create a new task and return the saved task with generated id
export const createTask = async (payload: CreateTaskPayload): Promise<Task> => {
  const { data } = await apiClient.post<Task>('/tasks', payload);
  return data;
};

// Update specific fields of an existing task — only provided fields are changed
export const updateTask = async (id: number, payload: UpdateTaskPayload): Promise<Task> => {
  const { data } = await apiClient.put<Task>(`/tasks/${id}`, payload);
  return data;
};

// Delete a task permanently — returns void as no data is needed after deletion
export const deleteTask = async (id: number): Promise<void> => {
  await apiClient.delete(`/tasks/${id}`);
};