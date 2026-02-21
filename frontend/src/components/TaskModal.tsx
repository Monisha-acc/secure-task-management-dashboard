import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Task, CreateTaskPayload } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTaskPayload) => void;
  task?: Task | null;
  isLoading?: boolean;
}

// Default values for a new task form
const defaultForm: CreateTaskPayload = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  due_date: '',
};

export default function TaskModal({ isOpen, onClose, onSubmit, task, isLoading }: Props) {
  const [form, setForm] = useState<CreateTaskPayload>(defaultForm);

  // Populate form when editing an existing task
  // Reset to defaults when opening for a new task 
  useEffect(() => {
    if (task) {
      setForm({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        due_date: task.due_date ?? '',
      });
    } else {
      setForm(defaultForm);
    }
  }, [task, isOpen]);

  // Convert empty due_date string to undefined before submitting
  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    onSubmit({ ...form, due_date: form.due_date || undefined });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - clicking closes the modal*/}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-lg card shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                 {/* Title changes based on create vs edit mode */}
                <h2 className="font-display font-bold text-xl text-white">
                  {task ? 'Edit Task' : 'New Task'}
                </h2>
                <button onClick={onClose} className="btn-ghost p-2 rounded-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Title *</label>
                  <input
                    className="input"
                    placeholder="Task title"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    required
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Description</label>
                  <textarea
                    className="input resize-none"
                    rows={3}
                    placeholder="Optional description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Status</label>
                    <select
                      className="input"
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value as Task['status'] })}
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Priority</label>
                    <select
                      className="input"
                      value={form.priority}
                      onChange={(e) => setForm({ ...form, priority: e.target.value as Task['priority'] })}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Due Date</label>
                  <input
                    type="date"
                    className="input"
                    value={form.due_date ?? ''}
                    onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancel</button>
                  <button type="submit" disabled={isLoading} className="btn-primary flex-1">
                    {isLoading ? 'Saving...' : task ? 'Save Changes' : 'Create Task'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}