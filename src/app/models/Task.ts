export interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: Date;
  isCompleted: boolean;
  status?: TaskStatus;
}

export interface NewTask {
  title: string;
  description: string;
  dueDate: Date;
  isCompleted?: boolean;
}

export type TaskStatus = 'Active' | 'Due' | 'Completed';
