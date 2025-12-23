export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface Task {
  id: number;
  userId: string;
  title: string;
  description: string | null;
  priority: TaskPriority;
  dueDate: string | null;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string | null;
}
