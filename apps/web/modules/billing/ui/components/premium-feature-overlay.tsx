'use client';

import { Button } from '@workspace/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@workspace/ui/components/card';
import {
  BookOpenIcon,
  BotIcon,
  BrushIcon,
  FileIcon,
  GemIcon,
  MicIcon,
  PhoneIcon,
  UsersIcon,
  type LucideIcon
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Feature {
  label: string;
  description: string;
  icon: LucideIcon;
}

interface PremiumFeatureOverlayProps {
  children: React.ReactNode;
}

const features: Feature[] = [
  {
    label: 'AI Customer Support',
    description: 'Intelligent customer support with AI',
    icon: BotIcon
  },
  {
    label: 'AI Voice Agent',
    description: 'Natural voice conversations with your customers',
    icon: MicIcon
  },
  {
    label: 'Phone System',
    description: 'Inbound & outbound calling capabilities',
    icon: PhoneIcon
  },
  {
    label: 'Knowledge Base',
    description: 'Train your AI with your own data',
    icon: BookOpenIcon
  },
  {
    label: 'Team Access',
    description: 'Up to 5 operators per organization',
    icon: UsersIcon
  },
  {
    label: 'Widget Customization',
    description: 'Customize your widget to match your brand',
    icon: BrushIcon
  }
];

export const PremiumFeatureOverlay = ({
  children
}: PremiumFeatureOverlayProps) => {
  const router = useRouter();
  return (
    <div className='relative min-h-screen'>
      <div
        className='pointer-events-none select-none blur-[2px]'
        aria-hidden='true'
      >
        {children}
      </div>

      <div className='absolute inset-0 bg-[#0e2229]/60 backdrop-blur-[2px]' />

      <div className='absolute inset-0 z-40 flex items-center justify-center p-4'>
        <Card className='w-full max-w-lg border-t-2 border-t-signal'>
          <CardHeader className='text-center'>
            <div className='flex items-center justify-center'>
              <div className='mb-2 inline-flex size-12 items-center justify-center bg-signal/20 text-signal-strong'>
                <GemIcon className='size-6' />
              </div>
            </div>
            <CardTitle className='font-display text-2xl font-semibold tracking-[-0.03em]'>
              Upgrade to Pro
            </CardTitle>
            <CardDescription>Get access to all features</CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='space-y-6'>
              {features.map((feature) => (
                <div key={feature.label} className='flex items-center gap-x-3'>
                  <div className='bg-secondary flex size-8 items-center justify-center'>
                    <feature.icon className='text-foreground size-4' />
                  </div>
                  <div className='text-left'>
                    <p className='text-sm font-medium'>{feature.label}</p>
                    <p className='text-muted-foreground text-sm'>
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Button
              className='font-display w-full'
              size='lg'
              variant='warning'
              onClick={() => {
                router.push('/billing');
              }}
            >
              Upgrade to Pro
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
