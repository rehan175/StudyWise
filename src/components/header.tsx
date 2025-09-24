import { Button } from '@/components/ui/button';
import { BookOpen, Plus } from 'lucide-react';

type HeaderProps = {
  onAddTaskClick: () => void;
};

export function Header({ onAddTaskClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-card/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 md:px-8">
        <div className="flex items-center gap-2">
          <BookOpen className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            StudyWise
          </h1>
        </div>
        <Button onClick={onAddTaskClick}>
          <Plus className="-ml-1 mr-2 h-5 w-5" />
          Add Task
        </Button>
      </div>
    </header>
  );
}
