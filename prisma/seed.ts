import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
	await prisma.user.createMany({
		data: [
			{
				id: 'c46ffdce-8ee7-470e-8b22-4e83c84481d2',
				username: 'testuser1',
				email: 'test1@example.com',
				password: '$2a$12$iikMNRVvK5cfuqGUW0fs4.w44gPqipPnJ75/OG2JTORo81RwIFOJa', // test1@example.com
				firstname: 'Test',
				lastname: 'User1',
			},
			{
				id: '3e9bc404-7958-4bd4-942e-54ea2dbe6592',
				username: 'testuser2',
				email: 'test2@example.com',
				password: '$2a$12$nJXXmOUWNQnR3qNU5FEWTOVxsFK9cS7upV.IVfVUeCOK0xLmR5Rqm', // test2@example.com
				firstname: 'Test',
				lastname: 'User2',
			},
		],
	});
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
