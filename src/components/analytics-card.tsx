'use client';

import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { Task } from '@/lib/types';
import { BarChart2 } from 'lucide-react';

type AnalyticsCardProps = {
  tasks: Task[];
};

export function AnalyticsCard({ tasks }: AnalyticsCardProps) {
  const chartData = useMemo(() => {
    const tasksByCategory = tasks.reduce((acc, task) => {
      acc[task.category] = (acc[task.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(tasksByCategory).map(([category, count]) => ({
      name: category,
      tasks: count,
    }));
  }, [tasks]);

  const chartConfig = {
    tasks: {
      label: 'Tasks',
      color: 'hsl(var(--primary))',
    },
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row items-center gap-3 space-y-0 mb-1">
            <BarChart2 className="h-6 w-6 text-primary" />
            <CardTitle>Task Analytics</CardTitle>
        </div>
        <CardDescription>Tasks distribution by category</CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                <YAxis allowDecimals={false} />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="tasks" fill="var(--color-tasks)" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <div className="text-center py-10 text-muted-foreground">
            No data to display. Add some tasks!
          </div>
        )}
      </CardContent>
    </Card>
  );
}
