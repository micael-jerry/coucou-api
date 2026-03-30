import { Injectable } from '@nestjs/common';
import { Prisma, User } from '../../../prisma/generated/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UserRepository {
	constructor(private readonly prisma: PrismaService) {}

	async findAll(): Promise<User[]> {
		return this.prisma.user.findMany();
	}

	async findById(id: string): Promise<User> {
		return this.prisma.user.findUniqueOrThrow({ where: { id } });
	}

	async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
		return this.prisma.user.update({
			where: { id },
			data,
		});
	}
}
