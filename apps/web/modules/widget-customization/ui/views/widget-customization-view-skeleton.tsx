import { WidgetCustomizationFormSkeleton } from '@/modules/widget-customization/ui/components/widget-customization-form';

export const WidgetCustomizationViewSkeleton = () => {
  return (
    <div className='flex h-full flex-col overflow-y-auto'>
      <div className='mb-4 flex flex-wrap items-center justify-between gap-2 border-b pb-4'>
        <div className='p-4'>
          <h2 className='font-display text-xl font-semibold tracking-[-0.03em]'>
            Widget Customization
          </h2>
          <p className='text-muted-foreground text-sm'>
            Customize how your chat widget looks and behaves for your customers
          </p>
        </div>
      </div>

      <div className='my-8 flex w-full max-w-screen-md flex-1 flex-col px-4'>
        <WidgetCustomizationFormSkeleton />
      </div>
    </div>
  );
};
