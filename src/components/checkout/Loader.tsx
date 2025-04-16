import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils'; 

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  className?: string;
}

export const Loader = ({
  size = 'md',
  message = 'Processing your request...',
  className
}: LoaderProps) => {
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-16 w-16',
    lg: 'h-24 w-24'
  };

  return (
    <div className={cn("container py-12 text-center", className)}>
      <div className="flex flex-col items-center justify-center space-y-4">
        <Loader2 
          className={cn(
            "text-muted-foreground animate-spin",
            sizes[size]
          )} 
        />
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  );
};