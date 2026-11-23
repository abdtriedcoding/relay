import { RelayWordmark } from '@workspace/ui/components/relay-brand';

export const ConversationsView = () => {
  return (
    <div className='bg-muted hidden h-full flex-1 flex-col gap-y-4 md:flex'>
      <div className='flex flex-1 items-center justify-center'>
        <RelayWordmark className='text-muted-foreground' markClassName='size-10' />
      </div>
    </div>
  );
};
