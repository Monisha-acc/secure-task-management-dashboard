import { useAuth } from "../context/AuthContext";
import { Task } from "../types";

interface Props {
  tasks: Task[];
}

export default function Header({ tasks }: Props) {
  const { username, logout } = useAuth();

  const stats = {
    total: tasks.length,
    done: tasks.filter((t) => t.status === "done").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    todo: tasks.filter((t) => t.status === "todo").length,
  };

  return (
    <header className="border-b border-surface-border bg-surface/80 backdrop-blur-sm sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
            <svg
              className="w-4 h-4 text-accent"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <span className="font-display font-bold text-white text-lg">
            TaskFlow
          </span>
        </div>

        {/* Stats pills — hidden on small screens */}
        <div className="hidden md:flex items-center gap-2">
          {[
            { label: "Total", value: stats.total, color: "text-white" },
            { label: "Todo", value: stats.todo, color: "text-slate-300" },
            {
              label: "In Progress",
              value: stats.inProgress,
              color: "text-amber-300",
            },
            { label: "Done", value: stats.done, color: "text-emerald-300" },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-card border border-slate-600"
            >
              <span className={`font-display font-bold text-sm ${color}`}>
                {value}
              </span>
              <span className="text-slate-300 text-xs">{label}</span>
            </div>
          ))}
        </div>

        {/* User area */}
        <div className="flex items-center gap-3">
          <span className="text-slate-200 text-sm hidden sm:block">
            @{username}
          </span>
          <button
            onClick={logout}
            className="btn-ghost text-sm flex items-center gap-2"
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
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </button>
        </div>
      </div>

      {/* Completion progress bar */}
      {tasks.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-3">
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-surface-border rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full bg-accent rounded-full transition-all duration-500"
                style={{ width: `${(stats.done / stats.total) * 100}%` }}
              />
            </div>
            <span className="text-xs text-slate-300 shrink-0">
              {Math.round((stats.done / stats.total) * 100)}% complete
            </span>
          </div>
        </div>
      )}
    </header>
  );
}
