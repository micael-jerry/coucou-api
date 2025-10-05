import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { AuthTokenPayload } from './payload/auth-token.payload';
import { VerifyEmailPayload } from './payload/verify-email.payload';
import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthUtils {
	constructor(private readonly jwtService: JwtService) {}

	async genAuthToken(user: User): Promise<string> {
		const payload: AuthTokenPayload = { user_id: user.id, user_username: user.username };
		return await this.jwtService.signAsync(payload);
	}

	getPayloadFromToken(token: string): AuthTokenPayload {
		return this.jwtService.verify<AuthTokenPayload>(token);
	}

	async genVerificationEmailToken(user: User): Promise<string> {
		const verifyEmailPayload: VerifyEmailPayload = {
			id: user.id,
			email: user.email,
			timestamp: Date.now(),
		};
		return await this.jwtService.signAsync(verifyEmailPayload);
	}

	hashPassword(password: string): string {
		return bcrypt.hashSync(password, bcrypt.genSaltSync());
	}

	isValidPassword(password: string, hashedPassword: string): boolean {
		return bcrypt.compareSync(password, hashedPassword);
	}
}
