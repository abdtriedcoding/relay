import { VapiPluginSkeleton } from '@/modules/plugins/ui/components/vapi-plugin';

export const VapiViewSkeleton = () => {
  return (
    <>
      <div className='mb-4 flex flex-wrap items-center justify-between gap-2 border-b pb-4'>
        <div className='p-4'>
          <h2 className='font-display text-xl font-semibold tracking-[-0.03em]'>VAPI Plugin</h2>
          <p className='text-muted-foreground text-sm'>
            Connect Vapi to enable AI voice calls and phone support
          </p>
        </div>
      </div>

      <div className='mt-8 flex h-full w-full max-w-screen-md flex-1 flex-col px-4'>
        <VapiPluginSkeleton />
      </div>
    </>
  );
};
