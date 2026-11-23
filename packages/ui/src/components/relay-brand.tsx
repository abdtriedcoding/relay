import { cn } from '@workspace/ui/lib/utils';

export function RelayMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox='0 0 40 40'
      fill='none'
      aria-hidden='true'
      className={cn('size-8 shrink-0', className)}
    >
      <rect width='40' height='40' rx='9' fill='#0E2229' />
      <path
        d='M13 30V11H20.5C25.2 11 25.2 20 20.5 20H13M19.5 20L27 29'
        stroke='#F3F5F2'
        strokeWidth='3.2'
        strokeLinecap='square'
        strokeLinejoin='miter'
      />
      <circle cx='28' cy='29.5' r='2.8' fill='#FFC94A' />
    </svg>
  );
}

export function RelayWordmark({
  className,
  markClassName,
  hideWordOnCollapse = false
}: {
  className?: string;
  markClassName?: string;
  hideWordOnCollapse?: boolean;
}) {
  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <RelayMark className={markClassName} />
      <span
        className={cn(
          'font-display text-[1.35rem] leading-none font-semibold tracking-[-0.045em]',
          hideWordOnCollapse && 'group-data-[collapsible=icon]:hidden'
        )}
      >
        relay
      </span>
    </span>
  );
}
