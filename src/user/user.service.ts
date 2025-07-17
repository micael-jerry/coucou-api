import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
	constructor(private readonly prismaService: PrismaService) {}

	findAll(): Promise<User[]> {
		return this.prismaService.user.findMany();
	}
}
