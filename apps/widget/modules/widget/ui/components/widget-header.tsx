import { Button } from '@workspace/ui/components/button';
import { cn } from '@workspace/ui/lib/utils';
import { HomeIcon, InboxIcon } from 'lucide-react';

interface WidgetHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const WidgetHeader = ({ children, className }: WidgetHeaderProps) => {
  return (
    <header
      className={cn(
        'border-b border-sidebar-border bg-sidebar px-4 py-3 text-sidebar-foreground',
        className
      )}
    >
      {children}
    </header>
  );
};
