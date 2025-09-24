export interface Task {
  id: string;
  text: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string; // Stored as ISO string
  completed: boolean;
}

export interface Goal {
  id: string;
  text: string;
  completed: boolean;
}
