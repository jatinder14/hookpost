import { Metadata } from 'next';
import { Agent } from '@hookpost/frontend/components/agents/agent';
export const metadata: Metadata = {
  title: 'Hookpost - Agent',
  description: 'agents',
};
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Agent>{children}</Agent>;
}
