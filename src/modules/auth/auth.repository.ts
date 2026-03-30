import { Injectable } from '@nestjs/common';
import { Prisma, User } from '../../../prisma/generated/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthRepository {
	constructor(private readonly prisma: PrismaService) {}

	async create(data: Prisma.UserCreateInput): Promise<User> {
		return this.prisma.user.create({ data });
	}

	async findByUsername(username: string): Promise<User> {
		return this.prisma.user.findUniqueOrThrow({ where: { username } });
	}

	async findById(id: string): Promise<User> {
		return this.prisma.user.findUniqueOrThrow({ where: { id } });
	}

	async findByEmail(email: string): Promise<User | null> {
		return this.prisma.user.findUnique({ where: { email } });
	}

	async findByEmailOrThrow(email: string): Promise<User> {
		return this.prisma.user.findUniqueOrThrow({ where: { email } });
	}

	async updateByEmail(email: string, data: Prisma.UserUpdateInput): Promise<User> {
		return this.prisma.user.update({
			where: { email },
			data,
		});
	}

	async updateById(id: string, data: Prisma.UserUpdateInput): Promise<User> {
		return this.prisma.user.update({
			where: { id },
			data,
		});
	}
}
