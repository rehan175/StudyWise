'use client';

import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Edit2, MoreVertical, Trash2, ListTodo } from 'lucide-react';
import type { Task } from '@/lib/types';
import { cn } from '@/lib/utils';

type TasksCardProps = {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleTask: (taskId: string) => void;
};

const priorityMap: { [key in Task['priority']]: { variant: 'destructive' | 'secondary' | 'default', label: string } } = {
  high: { variant: 'destructive', label: 'High' },
  medium: { variant: 'secondary', label: 'Medium' },
  low: { variant: 'default', label: 'Low' },
};

export function TasksCard({ tasks, onEditTask, onDeleteTask, onToggleTask }: TasksCardProps) {
  const sortedTasks = [...tasks].sort((a, b) => (a.completed ? 1 : -1) - (b.completed ? 1 : -1) || new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-3 space-y-0">
        <ListTodo className="h-6 w-6 text-primary" />
        <CardTitle>Your Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        {sortedTasks.length > 0 ? (
          <div className="space-y-4">
            <AnimatePresence>
              {sortedTasks.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-4 rounded-lg border p-3"
                >
                  <Checkbox
                    id={`task-${task.id}`}
                    checked={task.completed}
                    onCheckedChange={() => onToggleTask(task.id)}
                    className="h-5 w-5"
                  />
                  <div className="flex-1">
                    <label
                      htmlFor={`task-${task.id}`}
                      className={cn(
                        'font-medium transition-colors',
                        task.completed && 'text-muted-foreground line-through'
                      )}
                    >
                      {task.text}
                    </label>
                    <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1 flex-wrap">
                      <span>{task.category}</span>
                      <span className="text-xs">&bull;</span>
                      <span>Due {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}</span>
                    </div>
                  </div>
                  <Badge variant={priorityMap[task.priority].variant} className="hidden sm:inline-flex">
                    {priorityMap[task.priority].label}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEditTask(task)}>
                        <Edit2 className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDeleteTask(task.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground">You have no tasks yet.</p>
            <p className="text-sm text-muted-foreground">Click "Add Task" to get started!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
