'use client';

import { PricingTable } from '@/modules/billing/ui/components/pricing-table';

export const BillingView = () => {
  return (
    <div className='flex h-[calc(100vh-56px)] flex-col overflow-y-auto'>
      <div className='mb-4 flex flex-wrap items-center justify-between gap-2 border-b pb-4'>
        <div className='px-4'>
          <h2 className='font-display text-xl font-semibold tracking-[-0.03em]'>Plan & Billing</h2>
          <p className='text-muted-foreground text-sm'>
            Manage your subscription and billing information
          </p>
        </div>
      </div>

      <div className='my-8 flex w-full max-w-screen-md flex-1 flex-col px-4'>
        <PricingTable />
      </div>
    </div>
  );
};
