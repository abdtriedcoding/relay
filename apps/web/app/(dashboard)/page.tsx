import { RelayMark } from '@workspace/ui/components/relay-brand';
import { ArrowRight, Inbox, MessageSquareText, Settings2, BookOpen } from 'lucide-react';
import Link from 'next/link';

const shortcuts = [
  {
    href: '/conversations',
    icon: MessageSquareText,
    title: 'Conversations',
    detail: 'Read and answer live visitor messages'
  },
  {
    href: '/files',
    icon: BookOpen,
    title: 'Knowledge base',
    detail: 'Documents your assistant answers from'
  },
  {
    href: '/customization',
    icon: Settings2,
    title: 'Widget setup',
    detail: 'Greeting, appearance, and behavior'
  },
  {
    href: '/integrations',
    icon: Inbox,
    title: 'Integrations',
    detail: 'Connect the tools your team already uses'
  }
];

export default function Page() {
  return (
    <div className='mx-auto flex w-full max-w-6xl flex-col px-6 py-10 lg:px-10'>
      <div className='flex flex-col gap-8 border-b pb-10 lg:flex-row lg:items-end lg:justify-between'>
        <div className='max-w-xl'>
          <div className='mb-5 flex items-center gap-2'>
            <span className='size-2 bg-signal' aria-hidden='true' />
            <span className='text-xs font-medium tracking-[0.08em] text-muted-foreground'>
              Relay workspace
            </span>
          </div>
          <h1 className='font-display text-4xl leading-[1.05] font-semibold tracking-[-0.045em] sm:text-5xl'>
            Support in sync.
          </h1>
          <p className='mt-4 max-w-md text-[0.95rem] leading-relaxed text-muted-foreground'>
            One desk for conversations, knowledge, and the widget your visitors meet.
          </p>
        </div>
        <Link
          href='/conversations'
          className='bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-11 w-fit items-center gap-2 px-5 text-sm font-medium transition-colors'
        >
          Open the inbox
          <ArrowRight className='size-4' />
        </Link>
      </div>

      <div className='mt-10 grid gap-10 lg:grid-cols-[1.4fr_1fr]'>
        <section>
          <h2 className='font-display text-lg font-semibold tracking-[-0.02em]'>
            Jump back in
          </h2>
          <div className='mt-4 flex flex-col'>
            {shortcuts.map(({ href, icon: Icon, title, detail }) => (
              <Link
                key={href}
                href={href}
                className='group flex items-start gap-4 border-b py-4 transition-colors hover:bg-accent/60'
              >
                <span className='mt-0.5 flex size-9 shrink-0 items-center justify-center bg-secondary text-foreground'>
                  <Icon className='size-4' />
                </span>
                <span className='min-w-0'>
                  <span className='font-display block text-[0.95rem] font-medium'>
                    {title}
                  </span>
                  <span className='text-muted-foreground mt-0.5 block text-xs leading-relaxed'>
                    {detail}
                  </span>
                </span>
                <ArrowRight className='text-muted-foreground ml-auto mt-2 size-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100' />
              </Link>
            ))}
          </div>
        </section>

        <section className='bg-sidebar text-sidebar-foreground flex flex-col justify-between p-6'>
          <div>
            <RelayMark className='size-12' />
            <h2 className='font-display mt-8 text-2xl leading-tight font-semibold tracking-[-0.035em]'>
              A message always reaches someone.
            </h2>
            <p className='mt-3 text-sm leading-relaxed text-sidebar-foreground/70'>
              Relay routes visitor questions to your assistant first, then hands the
              conversation to your team when it matters.
            </p>
          </div>
          <div className='mt-10 flex items-center gap-3 border-t border-sidebar-border pt-5'>
            <span className='size-2 bg-signal' aria-hidden='true' />
            <span className='text-xs text-sidebar-foreground/70'>Widget is live for visitors</span>
          </div>
        </section>
      </div>
    </div>
  );
}
