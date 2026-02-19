import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import { fetchTasks, createTask, updateTask, deleteTask } from '../services/taskService';
import { Task, CreateTaskPayload } from '../types';
import Header from '../components/Header';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import FilterBar, { Filters } from '../components/FilterBar';

export default function DashboardPage() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filters, setFilters] = useState<Filters>({ search: '', status: 'all', priority: 'all' });

  // Fetch tasks with react-query — auto-refetch on window focus
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
  });

  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['tasks'] }); setModalOpen(false); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: CreateTaskPayload }) => updateTask(id, payload),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['tasks'] }); setModalOpen(false); setEditingTask(null); },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });

  const handleSubmit = (data: CreateTaskPayload) => {
    if (editingTask) {
      updateMutation.mutate({ id: editingTask.id, payload: data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleStatusChange = (id: number, status: Task['status']) => {
    updateMutation.mutate({ id, payload: { status } });
  };

  // Apply client-side filters
  const filtered = tasks.filter((t) => {
    const matchSearch = t.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      t.description.toLowerCase().includes(filters.search.toLowerCase());
    const matchStatus = filters.status === 'all' || t.status === filters.status;
    const matchPriority = filters.priority === 'all' || t.priority === filters.priority;
    return matchSearch && matchStatus && matchPriority;
  });

  return (
    <div className="min-h-screen bg-surface">
      <Header tasks={tasks} />

      <main className="max-w-6xl mx-auto px-6 py-8">
        <FilterBar
          filters={filters}
          onChange={setFilters}
          onNewTask={() => { setEditingTask(null); setModalOpen(true); }}
        />

        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-slate-500">
            <svg className="w-12 h-12 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="font-display font-semibold text-lg text-slate-400">
              {tasks.length === 0 ? 'No tasks yet' : 'No tasks match your filters'}
            </p>
            <p className="text-sm mt-1">
              {tasks.length === 0 ? 'Create your first task to get started' : 'Try adjusting your search or filters'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {filtered.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEdit}
                  onDelete={(id) => deleteMutation.mutate(id)}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      <TaskModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingTask(null); }}
        onSubmit={handleSubmit}
        task={editingTask}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}