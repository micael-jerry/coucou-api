import { defineConfig } from 'prisma/config';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
	migrations: {
		seed: 'ts-node --transpile-only prisma/seed.ts',
	},
});
