import { Task } from '../types';

// Filters state shape - 'all' means no filter applied
export interface Filters {
  search: string;
  status: Task['status'] | 'all';
  priority: Task['priority'] | 'all';
}

interface Props {
  filters: Filters;
  onChange: (filters: Filters) => void;
  onNewTask: () => void;
}

export default function FilterBar({ filters, onChange, onNewTask }: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center mb-6 p-4 bg-surface-card rounded-xl border border-surface-border">
      {/* Search input */}
      <div className="relative flex-1 w-full">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          className="input pl-10"
          placeholder="Search tasks..."
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
        />
      </div>

      {/* Status filter */}
      <select
        className="input w-full sm:w-36"
        value={filters.status}
        onChange={(e) => onChange({ ...filters, status: e.target.value as Filters['status'] })}
      >
        <option value="all">All Status</option>
        <option value="todo">To Do</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
      </select>

      {/* Priority filter */}
      <select
        className="input w-full sm:w-36"
        value={filters.priority}
        onChange={(e) => onChange({ ...filters, priority: e.target.value as Filters['priority'] })}
      >
        <option value="all">All Priority</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      {/* Opens the create task modal */}
      <button onClick={onNewTask} className="btn-primary whitespace-nowrap flex items-center gap-2 w-full sm:w-auto justify-center">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        New Task
      </button>
    </div>
  );
}