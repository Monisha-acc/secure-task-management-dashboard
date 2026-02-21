import { motion } from "framer-motion";
import { format, parseISO, isPast } from "date-fns";
import { Task } from "../types";

interface Props {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: Task["status"]) => void;
}

const STATUS_CYCLE: Record<Task["status"], Task["status"]> = {
  todo: "in-progress",
  "in-progress": "done",
  done: "todo",
};

const STATUS_LABELS: Record<Task["status"], string> = {
  todo: "To Do",
  "in-progress": "In Progress",
  done: "Done",
};

const PRIORITY_COLORS: Record<Task["priority"], string> = {
  low: "bg-blue-400/10 text-blue-400",
  medium: "bg-amber-400/10 text-amber-400",
  high: "bg-red-400/10 text-red-400",
};

const STATUS_COLORS: Record<Task["status"], string> = {
  todo: "bg-slate-400/10 text-slate-400",
  "in-progress": "bg-amber-400/10 text-amber-400",
  done: "bg-emerald-400/10 text-emerald-400",
};

export default function TaskCard({
  task,
  onEdit,
  onDelete,
  onStatusChange,
}: Props) {
  const isOverdue =
    task.due_date && isPast(parseISO(task.due_date)) && task.status !== "done";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ duration: 0.2 }}
      className="card group hover:border-accent/60 hover:shadow-xl hover:shadow-accent/10 hover:-translate-y-1 transition-all duration-200 min-h-32"
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3
          className={`font-display font-semibold text-lg text-white leading-snug ${task.status === "done" ? "line-through opacity-50" : ""}`}
        >
          {task.title}
        </h3>
        <div className="flex items-center gap-1.5 shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(task)}
            className="btn-ghost p-1.5 rounded-md"
            title="Edit task"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1.5 rounded-md text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200"
            title="Delete task"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-slate-300 text-sm mb-3 leading-relaxed line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Badges row */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Clickable status badge cycles through statuses */}
        <button
          onClick={() => onStatusChange(task.id, STATUS_CYCLE[task.status])}
          className={`badge ${STATUS_COLORS[task.status]} cursor-pointer hover:ring-1 hover:ring-current transition-all`}
          title="Click to advance status"
        >
          {STATUS_LABELS[task.status]}
        </button>

        <span className={`badge ${PRIORITY_COLORS[task.priority]}`}>
          {task.priority}
        </span>

        {task.due_date && (
          <span
            className={`badge ${isOverdue ? "bg-red-400/10 text-red-400" : "bg-slate-700/50 text-slate-300"}`}
          >
            {isOverdue && "⚠ "}
            {format(parseISO(task.due_date), "MMM d, yyyy")}
          </span>
        )}
      </div>
    </motion.div>
  );
}
