'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import type { Task } from '@/lib/types';
import { CalendarDays } from 'lucide-react';

type CalendarCardProps = {
  tasks: Task[];
};

export function CalendarCard({ tasks }: CalendarCardProps) {
  const deadlineDates = useMemo(() => tasks.map(task => new Date(task.dueDate)), [tasks]);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row items-center gap-3 space-y-0 mb-1">
            <CalendarDays className="h-6 w-6 text-primary" />
            <CardTitle>Calendar</CardTitle>
        </div>
        <CardDescription>Your deadlines at a glance.</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Calendar
          mode="multiple"
          selected={deadlineDates}
          className="rounded-md"
          classNames={{
            day_selected:
              'bg-primary/20 text-primary-foreground focus:bg-primary/20 focus:text-primary-foreground rounded-md',
            day_today: 'bg-accent/50 rounded-md',
          }}
        />
      </CardContent>
    </Card>
  );
}
