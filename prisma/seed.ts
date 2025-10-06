import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
	await prisma.user.createMany({
		data: [
			{
				id: 'c46ffdce-8ee7-470e-8b22-4e83c84481d2',
				username: 'testuser1',
				email: 'fidimalala.mj@gmail.com',
				password: '$2a$12$iikMNRVvK5cfuqGUW0fs4.w44gPqipPnJ75/OG2JTORo81RwIFOJa', // test1@example.com
				firstname: 'Test',
				lastname: 'User1',
				is_verified: true,
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

	await prisma.conversation.create({
		data: {
			id: '0dbea30e-9354-4bcb-964c-1b65098bcbbb',
			type: 'PRIVATE',
			members: {
				create: [
					{
						user_id: 'c46ffdce-8ee7-470e-8b22-4e83c84481d2',
					},
					{
						user_id: '3e9bc404-7958-4bd4-942e-54ea2dbe6592',
					},
				],
			},
		},
	});

	await prisma.message.createMany({
		data: [
			{
				id: '81cb0ce7-15ac-4bf9-888e-a9919a714af2',
				content: 'Hello from user 1',
				sender_id: 'c46ffdce-8ee7-470e-8b22-4e83c84481d2',
				conversation_id: '0dbea30e-9354-4bcb-964c-1b65098bcbbb',
			},
			{
				id: '75a280a6-be78-4d0a-89d6-7e8490aad6fc',
				content: 'Hello from user 2',
				sender_id: '3e9bc404-7958-4bd4-942e-54ea2dbe6592',
				conversation_id: '0dbea30e-9354-4bcb-964c-1b65098bcbbb',
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
