import { PostgresStore } from '@mastra/pg';

export const pStore = new PostgresStore({
  id: 'hookpost-store',
  connectionString: process.env.DATABASE_URL!,
});
