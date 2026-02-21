// Represents a user record in the database
export interface User {
  id: number;
  username: string;
  password_hash: string;
  created_at: string;
}

// Represents a task record in the database
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

// Payload for creating a new task — only title is required
export interface CreateTaskBody {
  title: string;
  description?: string;
  status?: Task['status'];
  priority?: Task['priority'];
  due_date?: string;
}

// All fields optional — allows partial updates to a task
export interface UpdateTaskBody extends Partial<CreateTaskBody> {}

// Payload for login and register requests
export interface AuthRequest {
  username: string;
  password: string;
}

// Extends Express Request to carry the authenticated user id
export interface AuthenticatedRequest extends Express.Request {
  userId?: number;
}