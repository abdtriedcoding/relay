import { Agent } from '@convex-dev/agent';
import { cohere } from '@ai-sdk/cohere';
import { components } from '../../../_generated/api';
import { SUPPORT_AGENT_PROMPT } from '../constants';

const supportAgent = new Agent(components.agent, {
  name: 'Support Agent',
  chat: cohere('command-a-03-2025'),
  instructions: SUPPORT_AGENT_PROMPT
});

export default supportAgent;
