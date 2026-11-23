import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from '@workspace/ui/components/resizable';
import { ConversationsSidebar } from '@/modules/conversations/ui/components/conversations-sidebar';

export const ConversationsLayout = ({
  children
}: {
  children: React.ReactNode;
}) => {
  return (
    <>
      <div className='mb-4 flex flex-wrap items-center justify-between gap-2 border-b pb-4'>
        <div className='px-4'>
          <h2 className='font-display text-xl font-semibold tracking-[-0.03em]'>Conversations</h2>
          <p className='text-muted-foreground text-sm'>
            Manage your conversations
          </p>
        </div>
      </div>
      <ResizablePanelGroup direction='horizontal' className='h-full flex-1'>
        <ResizablePanel defaultSize={30} maxSize={30} minSize={20}>
          <ConversationsSidebar />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={70} className='h-full'>
          {children}
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
};
