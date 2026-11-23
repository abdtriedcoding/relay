import { useMemo, useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@workspace/backend/_generated/api';
import { Button } from '@workspace/ui/components/button';
import {
  Loader2Icon,
  MessageSquareTextIcon,
  MicIcon,
  PhoneIcon
} from 'lucide-react';
import { useContactSessionId } from '@/modules/widget/store/use-contact-session-store';
import { useConversationActions } from '@/modules/widget/store/use-conversation-store';
import {
  useScreenActions,
  useScreenOrgId
} from '@/modules/widget/store/use-screen-store';
import { useVapiSecrets } from '@/modules/widget/store/use-vapi-secrets-store';
import { useWidgetSettings } from '@/modules/widget/store/use-widget-settings-store';
import { WidgetFooter } from '@/modules/widget/ui/components/widget-footer';
import { WidgetHeader } from '@/modules/widget/ui/components/widget-header';
import { WIDGET_SCREENS } from '../../types';

export const WidgetSelectionScreen = () => {
  const { setScreen, setError } = useScreenActions();
  const orgId = useScreenOrgId();
  const contactSessionId = useContactSessionId();
  const { setConversationId } = useConversationActions();
  const widgetSettings = useWidgetSettings();
  const publicKey = useVapiSecrets();

  const [isPendingCreateConversation, setIsPendingCreateConversation] =
    useState(false);

  const createConversation = useMutation(api.public.conversations.create);

  const handleStartChat = async () => {
    if (!orgId) {
      setScreen(WIDGET_SCREENS.ERROR);
      setError('No organization found');
      return;
    }

    if (!contactSessionId) {
      setScreen(WIDGET_SCREENS.AUTH);
      return;
    }

    setIsPendingCreateConversation(true);
    try {
      const { id } = await createConversation({
        orgId,
        contactSessionId
      });

      setConversationId(id);

      setScreen(WIDGET_SCREENS.CHAT);
    } catch (error) {
      console.error('handleStartChat error', error);
      setScreen(WIDGET_SCREENS.AUTH);
    } finally {
      setIsPendingCreateConversation(false);
    }
  };

  const handleStartVoice = () => {
    setScreen(WIDGET_SCREENS.VOICE);
  };

  const handleStartPhoneCall = () => {
    setScreen(WIDGET_SCREENS.CONTACT);
  };

  const isShouldShowVoice = useMemo(() => {
    return !!publicKey && !!widgetSettings?.vapiSettings?.assistantId;
  }, [publicKey, widgetSettings]);

  const isShouldShowPhoneCall = useMemo(() => {
    return !!publicKey && !!widgetSettings?.vapiSettings?.phoneNumber;
  }, [publicKey, widgetSettings]);

  return (
    <>
      <WidgetHeader>
        <div className='flex flex-col gap-y-1.5 px-2 py-5'>
          <p className='text-xs tracking-[0.08em] text-sidebar-foreground/60'>
            Relay support
          </p>
          <p className='font-display text-2xl leading-tight font-semibold tracking-[-0.035em]'>
            How can we help?
          </p>
        </div>
      </WidgetHeader>
      <div className='flex flex-1 flex-col gap-y-4 overflow-y-auto p-4'>
        {/* Start chat */}
        <Button
          className='signal-edge h-16 w-full justify-start gap-3 bg-card px-5 text-left hover:bg-accent'
          variant='outline'
          onClick={handleStartChat}
          disabled={isPendingCreateConversation}
        >
          {isPendingCreateConversation ? (
            <>
              <Loader2Icon className='size-4 animate-spin' />
              <span>Creating conversation...</span>
            </>
          ) : (
            <>
              <MessageSquareTextIcon className='size-5 text-signal-strong' />
              <span className='font-display text-base font-medium'>Start chat</span>
            </>
          )}
        </Button>

        {/* Start voice */}
        {isShouldShowVoice && (
          <Button
            className='signal-edge h-16 w-full justify-start gap-3 bg-card px-5 text-left hover:bg-accent'
            variant='outline'
            onClick={handleStartVoice}
          >
            <MicIcon className='size-5 text-signal-strong' />
            <span className='font-display text-base font-medium'>Start voice call</span>
          </Button>
        )}

        {/* Start phone call */}
        {isShouldShowPhoneCall && (
          <Button
            className='signal-edge h-16 w-full justify-start gap-3 bg-card px-5 text-left hover:bg-accent'
            variant='outline'
            onClick={handleStartPhoneCall}
            disabled={isPendingCreateConversation}
          >
            <PhoneIcon className='size-5 text-signal-strong' />
            <span className='font-display text-base font-medium'>Call us</span>
          </Button>
        )}
      </div>
      <WidgetFooter />
    </>
  );
};
