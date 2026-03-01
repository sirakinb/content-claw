import { useDroppable } from '@dnd-kit/core';
import type { Column, Task } from '../types';
import { KanbanCard } from './KanbanCard';
import { cn } from '../lib/utils';
import { MoreHorizontal, Plus } from 'lucide-react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

interface Props {
  column: Column;
  tasks: Task[];
  onAddTask: (columnId: string) => void;
  onTaskClick: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

export function KanbanColumn({ column, tasks, onAddTask, onTaskClick, onDeleteTask }: Props) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: 'Column',
      column,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex-1 min-w-[320px] max-w-[450px] flex-shrink-0 flex flex-col gap-4 rounded-2xl p-4 glass-column transition-colors duration-200',
        isOver && 'bg-surface-100/60 ring-1 ring-primary-transparent'
      )}
    >
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/5">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-gray-200">{column.title}</h2>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-surface-200 text-gray-400">
            {tasks.length}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3 flex-grow overflow-y-auto scrollbar-hide min-h-[100px]">
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <KanbanCard key={task.id} task={task} onClick={onTaskClick} onDelete={onDeleteTask} />
          ))}
        </SortableContext>
        
        <button
          onClick={() => onAddTask(column.id)}
          className="mt-2 w-full py-3 px-4 rounded-xl border border-dashed border-white/10 text-gray-400 text-sm flex items-center justify-center gap-2 hover:bg-surface-100 hover:text-gray-200 hover:border-primary/50 transition-all group"
        >
          <Plus size={16} className="text-gray-500 group-hover:text-primary transition-colors" />
          <span>Add Task</span>
        </button>
      </div>
    </div>
  );
}
