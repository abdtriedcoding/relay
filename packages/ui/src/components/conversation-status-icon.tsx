import { cn } from '@workspace/ui/lib/utils';
import { ArrowRightIcon, ArrowUpIcon, CheckIcon } from 'lucide-react';

interface ConversationStatusIconProps {
  status: 'unresolved' | 'escalated' | 'resolved';
  className?: string;
}

const statusMap = {
  unresolved: {
    icon: ArrowRightIcon,
    bgColor: 'bg-destructive text-destructive-foreground'
  },
  escalated: {
    icon: ArrowUpIcon,
    bgColor: 'bg-signal text-[#12262e]'
  },
  resolved: {
    icon: CheckIcon,
    bgColor: 'bg-success text-white'
  }
} as const;

export const ConversationStatusIcon = ({
  status,
  className
}: ConversationStatusIconProps) => {
  const { icon: Icon, bgColor } = statusMap[status];

  return (
    <div
      className={cn(
        'flex items-center justify-center p-1.5',
        bgColor,
        className
      )}
    >
      <Icon className='stroke-3 size-3' />
    </div>
  );
};
