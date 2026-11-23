import { Separator } from '@workspace/ui/components/separator';
import { SidebarTrigger } from '@workspace/ui/components/sidebar';
import { ThemeToggle } from '@/components/theme-toggle';
import SearchWithKbar from './search-with-kbar';

export const AppHeader = () => {
  return (
    <header className='group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-14 shrink-0 items-center justify-between gap-2 border-b bg-card/70 backdrop-blur-sm'>
      <div className='flex items-center gap-2 px-4'>
        <SidebarTrigger className='-ml-1 text-muted-foreground hover:text-foreground' />
        <Separator orientation='vertical' className='mr-1 h-4' />
        <span className='font-display text-[0.95rem] font-medium tracking-[-0.02em] text-foreground'>
          Support desk
        </span>
        <span className='size-1.5 bg-signal' aria-hidden='true' />
      </div>

      <div className='flex items-center gap-2 px-4 text-sm'>
        <SearchWithKbar />
        <ThemeToggle />
      </div>
    </header>
  );
};
