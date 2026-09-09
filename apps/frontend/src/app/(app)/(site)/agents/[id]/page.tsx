import { Metadata } from 'next';
import { Agent } from '@hookpost/frontend/components/agents/agent';
import { AgentChat } from '@hookpost/frontend/components/agents/agent.chat';
export const metadata: Metadata = {
  title: 'Hookpost - Agent',
  description: '',
};
export default async function Page() {
  return (
    <AgentChat />
  );
}
