import { EMBED_CONFIG } from './config';
import { closeIcon, relayMarkIcon } from './icons';

(function () {
  let iframe: HTMLIFrameElement | null = null;
  let container: HTMLDivElement | null = null;
  let button: HTMLButtonElement | null = null;
  let isOpen = false;

  // Get configuration from script tag
  let orgId: string | null = null;
  let position: 'bottom-right' | 'bottom-left' = EMBED_CONFIG.DEFAULT_POSITION;

  // Try to get the current script
  const currentScript = document.currentScript as HTMLScriptElement;

  if (currentScript) {
    orgId = currentScript.getAttribute('data-org-id');
    position =
      (currentScript.getAttribute('data-position') as
        | 'bottom-right'
        | 'bottom-left') || EMBED_CONFIG.DEFAULT_POSITION;
  } else {
    // Fallback: find script tag by src
    const scripts = document.querySelectorAll(
      'script[src*="relay-widget"], script[src*="echo-widget"], script[src*="embed"]'
    );
    const embedScript = Array.from(scripts).find((script) =>
      script.hasAttribute('data-org-id')
    ) as HTMLScriptElement;

    if (embedScript) {
      orgId = embedScript.getAttribute('data-org-id');
      position =
        (embedScript.getAttribute('data-position') as
          | 'bottom-right'
          | 'bottom-left') || EMBED_CONFIG.DEFAULT_POSITION;
    }
  }

  // Exit if no organization ID
  if (!orgId) {
    console.error('Relay Widget: data-org-id attribute is required');
    return;
  }

  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', render);
    } else {
      render();
    }
  }

  function render() {
    // Create floating action button
    button = document.createElement('button');
    button.type = 'button';
    button.id = 'relay-widget-button';
    button.innerHTML = relayMarkIcon;
    button.setAttribute('aria-label', 'Open Relay support chat');
    button.style.cssText = `
      position: fixed;
      ${position === 'bottom-right' ? 'right: 20px;' : 'left: 20px;'}
      bottom: 20px;
      width: 60px;
      height: 60px;
      border-radius: 14px;
      background: #0e2229;
      color: #f3f5f2;
      border: 1px solid #24434b;
      cursor: pointer;
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 6px 20px rgba(14, 34, 41, 0.28);
      transition: transform 0.18s ease, box-shadow 0.18s ease;
    `;

    button.addEventListener('click', toggleWidget);
    button.addEventListener('mouseenter', () => {
      if (button) button.style.transform = 'scale(1.05)';
    });
    button.addEventListener('mouseleave', () => {
      if (button) button.style.transform = 'scale(1)';
    });

    document.body.appendChild(button);

    // Create container (hidden by default)
    container = document.createElement('div');
    container.id = 'relay-widget-container';
    container.style.cssText = `
      position: fixed;
      ${position === 'bottom-right' ? 'right: 20px;' : 'left: 20px;'}
      bottom: 90px;
      width: 400px;
      height: 600px;
      max-width: calc(100vw - 40px);
      max-height: calc(100vh - 110px);
      z-index: 999998;
      border-radius: 6px;
      overflow: hidden;
      box-shadow: 0 12px 36px rgba(14, 34, 41, 0.22);
      display: none;
      opacity: 0;
      transform: translateY(10px);
      transition: all 0.3s ease;
    `;

    // Create iframe
    iframe = document.createElement('iframe');
    iframe.src = buildWidgetUrl();
    iframe.style.cssText = `
      width: 100%;
      height: 100%;
      border: none;
    `;
    // Add permissions for microphone and clipboard
    iframe.allow = 'microphone; clipboard-read; clipboard-write';

    container.appendChild(iframe);
    document.body.appendChild(container);

    // Handle messages from widget
    window.addEventListener('message', handleMessage);
  }

  function buildWidgetUrl(): string {
    const params = new URLSearchParams();
    params.append('orgId', orgId!);
    return `${EMBED_CONFIG.WIDGET_URL}?${params.toString()}`;
  }

  function handleMessage(event: MessageEvent) {
    if (event.origin !== new URL(EMBED_CONFIG.WIDGET_URL).origin) return;
    if (typeof event.data !== 'object' || event.data === null) return;

    const { type, payload } = event.data;

    switch (type) {
      case 'close':
        hide();
        break;
      case 'resize':
        if (payload.height && container) {
          container.style.height = `${payload.height}px`;
        }
        break;
    }
  }

  function toggleWidget() {
    if (isOpen) {
      hide();
    } else {
      show();
    }
  }

  function show() {
    if (container && button) {
      isOpen = true;
      container.style.display = 'block';
      // Trigger animation
      setTimeout(() => {
        if (container) {
          container.style.opacity = '1';
          container.style.transform = 'translateY(0)';
        }
      }, 10);
      // Change button icon to close
      button.innerHTML = closeIcon;
    }
  }

  function hide() {
    if (container && button) {
      isOpen = false;
      container.style.opacity = '0';
      container.style.transform = 'translateY(10px)';
      // Hide after animation
      setTimeout(() => {
        if (container) container.style.display = 'none';
      }, 300);
      // Change button icon back to chat
      button.innerHTML = relayMarkIcon;
      button.style.background = '#0e2229';
    }
  }

  function destroy() {
    window.removeEventListener('message', handleMessage);
    if (container) {
      container.remove();
      container = null;
      iframe = null;
    }
    if (button) {
      button.remove();
      button = null;
    }
    isOpen = false;
  }

  // Function to reinitialize with new config
  function reinit(newConfig: {
    orgId?: string;
    position?: 'bottom-right' | 'bottom-left';
  }) {
    // Destroy existing widget
    destroy();

    // Update config
    if (newConfig.orgId) {
      orgId = newConfig.orgId;
    }
    if (newConfig.position) {
      position = newConfig.position;
    }

    // Reinitialize
    init();
  }

  // Expose API to global scope
  const api = {
    init: reinit,
    show,
    hide,
    destroy
  };

  (window as any).RelayWidget = api;
  // Backwards-compatible alias for embeds built against the old global name
  (window as any).EchoWidget = api;

  // Auto-initialize
  init();
})();
