import { RelayWordmark } from '@workspace/ui/components/relay-brand';

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className='bg-background grid min-h-screen lg:grid-cols-[minmax(320px,0.85fr)_1.15fr]'>
      <aside className='bg-sidebar text-sidebar-foreground hidden flex-col justify-between p-10 lg:flex'>
        <RelayWordmark className='text-sidebar-foreground' markClassName='size-10' />
        <div className='max-w-sm'>
          <h1 className='font-display text-4xl leading-[1.08] font-semibold tracking-[-0.045em]'>
            Every conversation has a next step.
          </h1>
          <p className='mt-4 text-sm leading-relaxed text-sidebar-foreground/70'>
            Relay keeps your inbox, knowledge, and visitors connected from one desk.
          </p>
        </div>
        <p className='text-xs text-sidebar-foreground/50'>Secure access for your team</p>
      </aside>
      <div className='flex items-center justify-center p-6'>{children}</div>
    </main>
  );
};
