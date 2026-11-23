import { AlertCircleIcon } from 'lucide-react';
import { useScreenError } from '@/modules/widget/store/use-screen-store';
import { WidgetHeader } from '@/modules/widget/ui/components/widget-header';

export const WidgetErrorScreen = () => {
  const error = useScreenError();

  return (
    <>
      <WidgetHeader>
        <div className='flex flex-col gap-y-1.5 px-2 py-5'>
          <p className='text-xs tracking-[0.08em] text-sidebar-foreground/60'>
            Relay support
          </p>
          <p className='font-display text-2xl leading-tight font-semibold tracking-[-0.035em]'>
            We hit a snag
          </p>
        </div>
      </WidgetHeader>
      <div className='flex flex-1 flex-col items-center justify-center gap-y-4 p-4'>
        <AlertCircleIcon className='text-destructive' />
        <p className='text-sm'>
          {error || 'Something went wrong. Please try again later.'}
        </p>
      </div>
    </>
  );
};
