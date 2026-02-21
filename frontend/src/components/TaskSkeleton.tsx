// Placeholder card shown while tasks are loading
// Mimics the structure of TaskCard to prevent layout shift
export default function TaskSkeleton() {
  return (
    <div className="card animate-pulse">
      {/* Fake title */}
      <div className="h-5 bg-surface-border rounded w-3/4 mb-3" />
      {/* Fake description lines */}
      <div className="h-3 bg-surface-border rounded w-full mb-1.5" />
      <div className="h-3 bg-surface-border rounded w-2/3 mb-4" />
      {/* Fake badges */}
      <div className="flex gap-2">
        <div className="h-6 bg-surface-border rounded-full w-16" />
        <div className="h-6 bg-surface-border rounded-full w-12" />
      </div>
    </div>
  );
}