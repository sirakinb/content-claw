import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type {
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { KanbanColumn } from './KanbanColumn';
import { KanbanCard } from './KanbanCard';
import { TaskModal } from './TaskModal';
import type { BoardData, Task } from '../types';
import { initialData } from '../data';

export function KanbanBoard() {
  const [board, setBoard] = useState<BoardData>(initialData);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const { id } = active;
    
    if (active.data.current?.type === 'Task') {
      const task = board.tasks.find((task) => task.id === id);
      if (task) setActiveTask(task);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === 'Task';
    const isOverTask = over.data.current?.type === 'Task';
    const isOverColumn = over.data.current?.type === 'Column';

    if (!isActiveTask) return;

    // Dropping a task over another task
    if (isActiveTask && isOverTask) {
      setBoard((prev) => {
        const activeIndex = prev.tasks.findIndex((t) => t.id === activeId);
        const overIndex = prev.tasks.findIndex((t) => t.id === overId);

        if (prev.tasks[activeIndex].columnId !== prev.tasks[overIndex].columnId) {
          const newTasks = [...prev.tasks];
          newTasks[activeIndex].columnId = newTasks[overIndex].columnId;
          return {
            ...prev,
            tasks: arrayMove(newTasks, activeIndex, overIndex - 1),
          };
        }

        return {
          ...prev,
          tasks: arrayMove(prev.tasks, activeIndex, overIndex),
        };
      });
    }

    // Dropping a task over a column
    if (isActiveTask && isOverColumn) {
      setBoard((prev) => {
        const activeIndex = prev.tasks.findIndex((t) => t.id === activeId);
        
        const newTasks = [...prev.tasks];
        newTasks[activeIndex].columnId = overId as string;
        
        return {
          ...prev,
          tasks: arrayMove(newTasks, activeIndex, activeIndex),
        };
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === 'Task';
    const isOverTask = over.data.current?.type === 'Task';

    if (isActiveTask && isOverTask) {
      setBoard((prev) => {
        const activeIndex = prev.tasks.findIndex((t) => t.id === activeId);
        const overIndex = prev.tasks.findIndex((t) => t.id === overId);

        return {
          ...prev,
          tasks: arrayMove(prev.tasks, activeIndex, overIndex),
        };
      });
    }
  };

  const addTask = (columnId: string) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      columnId,
      content: 'New content idea',
      sourceFile: 'MANUAL',
      scriptNumber: '#NEW',
      createdAt: new Date().toISOString(),
    };
    
    setBoard((prev) => ({
      ...prev,
      tasks: [...prev.tasks, newTask],
    }));
  };

  const deleteTask = (taskId: string) => {
    setBoard((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== taskId),
    }));
    if (selectedTask?.id === taskId) {
      setSelectedTask(null);
    }
  };

  return (
    <div className="w-full h-full flex justify-center gap-8 p-6 overflow-x-auto">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {board.columns.map((col) => (
          <KanbanColumn
            key={col.id}
            column={col}
            tasks={board.tasks.filter((task) => task.columnId === col.id)}
            onAddTask={addTask}
            onTaskClick={setSelectedTask}
            onDeleteTask={deleteTask}
          />
        ))}

        <DragOverlay>
          {activeTask ? <KanbanCard task={activeTask} onClick={() => {}} /> : null}
        </DragOverlay>
      </DndContext>

      {selectedTask && (
        <TaskModal 
          task={selectedTask} 
          onClose={() => setSelectedTask(null)} 
          onDelete={deleteTask}
        />
      )}
    </div>
  );
}
