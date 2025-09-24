'use client';

import { useLocalStorage } from '@/hooks/use-local-storage';
import type { Task, Goal } from '@/lib/types';
import { useState, useMemo } from 'react';
import { Header } from '@/components/header';
import { TaskDialog } from '@/components/task-dialog';
import { GoalsCard } from '@/components/goals-card';
import { TasksCard } from '@/components/tasks-card';
import { AnalyticsCard } from '@/components/analytics-card';
import { SchedulerCard } from '@/components/scheduler-card';
import { CalendarCard } from '@/components/calendar-card';

const initialTasks: Task[] = [
    { id: '1', text: 'Review Chapter 3 notes', category: 'Biology', priority: 'high', dueDate: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(), completed: false },
    { id: '2', text: 'Complete math homework', category: 'Math', priority: 'medium', dueDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(), completed: false },
    { id: '3', text: 'Start history essay draft', category: 'History', priority: 'low', dueDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(), completed: true },
];

export default function Home() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', initialTasks);
  const [dailyGoal, setDailyGoal] = useLocalStorage<Goal>('dailyGoal', { id: 'daily', text: 'Finish today\'s top priority tasks', completed: false });
  const [weeklyGoal, setWeeklyGoal] = useLocalStorage<Goal>('weeklyGoal', { id: 'weekly', text: 'Complete all medium priority tasks', completed: false });

  const [isTaskDialogOpen, setTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleAddNewTask = () => {
    setEditingTask(null);
    setTaskDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setTaskDialogOpen(true);
  };

  const handleSaveTask = (taskData: Omit<Task, 'id' | 'completed'> & { id?: string }) => {
    if (editingTask) {
      setTasks(tasks.map((t) => (t.id === editingTask.id ? { ...t, ...taskData, id: t.id } : t)));
    } else {
      setTasks([...tasks, { ...taskData, id: crypto.randomUUID(), completed: false }]);
    }
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((t) => t.id !== taskId));
  };

  const handleToggleTaskCompletion = (taskId: string) => {
    setTasks(tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t)));
  };

  const goals = useMemo(() => [
    {...dailyGoal, type: 'Daily'},
    {...weeklyGoal, type: 'Weekly'}
  ], [dailyGoal, weeklyGoal]);

  const allGoals = useMemo(() => ({
    daily: dailyGoal,
    weekly: weeklyGoal
  }), [dailyGoal, weeklyGoal]);

  const setAllGoals = (newGoals: { daily: Goal, weekly: Goal }) => {
    setDailyGoal(newGoals.daily);
    setWeeklyGoal(newGoals.weekly);
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header onAddTaskClick={handleAddNewTask} />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="space-y-6">
                <GoalsCard
                  tasks={tasks}
                  goals={allGoals}
                  setGoals={setAllGoals}
                />
                <TasksCard
                  tasks={tasks}
                  onEditTask={handleEditTask}
                  onDeleteTask={handleDeleteTask}
                  onToggleTask={handleToggleTaskCompletion}
                />
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="space-y-6">
                <SchedulerCard tasks={tasks} goals={goals.map(g => g.text)} />
                <CalendarCard tasks={tasks} />
                <AnalyticsCard tasks={tasks} />
              </div>
            </div>
          </div>
        </div>
      </main>
      <TaskDialog
        open={isTaskDialogOpen}
        onOpenChange={setTaskDialogOpen}
        onTaskSave={handleSaveTask}
        task={editingTask}
      />
    </div>
  );
}
