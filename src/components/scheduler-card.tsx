'use client';

import { useState } from 'react';
import { generateStudySchedule } from '@/ai/flows/generate-study-schedule';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Sparkles, Loader2 } from 'lucide-react';
import type { Task } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

type SchedulerCardProps = {
  tasks: Task[];
  goals: string[];
};

export function SchedulerCard({ tasks, goals }: SchedulerCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [schedule, setSchedule] = useState('');
  const { toast } = useToast();

  const handleGenerateSchedule = async () => {
    setIsLoading(true);
    setSchedule('');

    const formattedTasks = tasks
      .map(t => `${t.category}: ${t.text} (due ${new Date(t.dueDate).toLocaleDateString()}, ${t.priority} priority)`)
      .join('\n');
    
    const formattedGoals = goals.join(', ');

    try {
      const result = await generateStudySchedule({
        goals: formattedGoals || 'Plan my study schedule.',
        tasks: formattedTasks || 'No specific tasks provided.',
      });
      if (result.schedule) {
        setSchedule(result.schedule);
      } else {
        throw new Error('AI did not return a schedule.');
      }
    } catch (error) {
      console.error('Failed to generate schedule:', error);
      toast({
        title: 'Error',
        description: 'Could not generate a schedule. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row items-center gap-3 space-y-0 mb-1">
            <Sparkles className="h-6 w-6 text-primary" />
            <CardTitle>Smart Scheduler</CardTitle>
        </div>
        <CardDescription>Let AI create a study plan for you.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <Button onClick={handleGenerateSchedule} disabled={isLoading} className="w-full">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Generate Schedule
        </Button>
        {schedule && (
          <div className="mt-4 w-full rounded-lg border bg-muted/50 p-4 text-sm">
            <h4 className="font-semibold mb-2">Suggested Schedule:</h4>
            <pre className="whitespace-pre-wrap font-sans">{schedule}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
