'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Target } from 'lucide-react';
import type { Task, Goal } from '@/lib/types';

type GoalsCardProps = {
  tasks: Task[];
  goals: {
    daily: Goal;
    weekly: Goal;
  };
  setGoals: (goals: { daily: Goal; weekly: Goal }) => void;
};

export function GoalsCard({ tasks, goals, setGoals }: GoalsCardProps) {
  const completedTasks = useMemo(() => tasks.filter(task => task.completed).length, [tasks]);
  const totalTasks = tasks.length;
  
  const dailyProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const weeklyTasks = useMemo(() => tasks.filter(task => task.priority === 'medium' || task.priority === 'high'), [tasks]);
  const completedWeeklyTasks = useMemo(() => weeklyTasks.filter(task => task.completed).length, [weeklyTasks]);
  const weeklyProgress = weeklyTasks.length > 0 ? (completedWeeklyTasks / weeklyTasks.length) * 100 : 0;
  
  const handleDailyGoalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGoals({ ...goals, daily: { ...goals.daily, text: e.target.value } });
  };
  
  const handleWeeklyGoalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGoals({ ...goals, weekly: { ...goals.weekly, text: e.target.value } });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-3 space-y-0">
        <Target className="h-6 w-6 text-primary" />
        <CardTitle>Your Study Goals</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="daily-goal">Daily Goal</Label>
          <Input
            id="daily-goal"
            value={goals.daily.text}
            onChange={handleDailyGoalChange}
            placeholder="e.g., Complete today's priority tasks"
          />
          <div className="flex items-center gap-2 pt-1">
            <Progress value={dailyProgress} className="w-full" />
            <span className="text-sm font-medium text-muted-foreground">{Math.round(dailyProgress)}%</span>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="weekly-goal">Weekly Goal</Label>
          <Input
            id="weekly-goal"
            value={goals.weekly.text}
            onChange={handleWeeklyGoalChange}
            placeholder="e.g., Revise all subjects"
          />
          <div className="flex items-center gap-2 pt-1">
            <Progress value={weeklyProgress} className="w-full" />
            <span className="text-sm font-medium text-muted-foreground">{Math.round(weeklyProgress)}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
