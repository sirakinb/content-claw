import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from '../types';
import { cn } from '../lib/utils';
import { GripVertical, Trash2 } from 'lucide-react';

interface Props {
  task: Task;
  onClick: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

export function KanbanCard({ task, onClick, onDelete }: Props) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => onClick(task)}
      className={cn(
        'glass-card rounded-xl p-4 flex flex-col gap-3 group relative overflow-hidden shrink-0 cursor-pointer',
        isDragging && 'opacity-30 border-primary ring-2 ring-primary ring-opacity-50'
      )}
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary-light to-primary opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          {task.scriptNumber && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary-light border border-primary/20">
              {task.scriptNumber}
            </span>
          )}
          {task.sourceFile && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-surface-50 text-gray-400 border border-white/5 truncate max-w-[120px]">
              {task.sourceFile.replace('.md', '')}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm('Are you sure you want to delete this task?')) {
                  onDelete(task.id);
                }
              }}
              className="text-gray-500 hover:text-red-400 transition-colors p-1"
              title="Delete task"
            >
              <Trash2 size={16} />
            </button>
          )}
          <button
            {...attributes}
            {...listeners}
            onClick={(e) => e.stopPropagation()}
            className="text-gray-500 hover:text-gray-300 transition-colors p-1 cursor-grab active:cursor-grabbing"
          >
            <GripVertical size={16} />
          </button>
        </div>
      </div>
      
      <p className="text-sm font-medium leading-relaxed text-gray-100">
        {task.content}
      </p>
      
      <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
          {new Date(task.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
      </div>
    </div>
  );
}
