export interface Task {
  id: number;
  user_id: number;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export type CreateTaskPayload = {
  title: string;
  description?: string;
  status?: Task['status'];
  priority?: Task['priority'];
  due_date?: string;
};

export type UpdateTaskPayload = Partial<CreateTaskPayload>;

export interface AuthPayload {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  username: string;
}