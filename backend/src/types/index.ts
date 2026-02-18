export interface User {
  id: number;
  username: string;
  password_hash: string;
  created_at: string;
}

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

export interface CreateTaskBody {
  title: string;
  description?: string;
  status?: Task['status'];
  priority?: Task['priority'];
  due_date?: string;
}

export interface UpdateTaskBody extends Partial<CreateTaskBody> {}

export interface AuthRequest {
  username: string;
  password: string;
}

// Extends Express Request to carry the authenticated user id
export interface AuthenticatedRequest extends Express.Request {
  userId?: number;
}