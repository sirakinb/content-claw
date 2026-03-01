export interface Task {
  id: string;
  columnId: string;
  content: string;
  sourceFile: string;
  scriptNumber: string;
  createdAt: string;
  category?: string;
  status?: string;
  hookAudio?: string;
  hookText?: string;
  hookVisual?: string;
  caption?: string;
  scriptBody?: string;
  cta?: string;
}

export interface Column {
  id: string;
  title: string;
}

export type BoardData = {
  columns: Column[];
  tasks: Task[];
};
