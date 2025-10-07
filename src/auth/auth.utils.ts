import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { AuthTokenPayload } from './payload/auth-token.payload';
import { SpecificReqTokenPayload } from './payload/specific-req-token.payload';

@Injectable()
export class AuthUtils {
	constructor(private readonly jwtService: JwtService) {}

	async getPayloadToken<T extends object = any>(token: string): Promise<T> {
		return await this.jwtService.verifyAsync<T>(token);
	}

	async genAuthToken(user: User): Promise<string> {
		const payload: AuthTokenPayload = { user_id: user.id, user_username: user.username, user_role: user.role };
		return await this.jwtService.signAsync(payload);
	}

	async genSpecificRequestToken(user: User): Promise<string> {
		const verifyEmailPayload: SpecificReqTokenPayload = {
			id: user.id,
			email: user.email,
			timestamp: Date.now(),
		};
		return await this.jwtService.signAsync(verifyEmailPayload, { expiresIn: '1h' });
	}

	async hashPassword(password: string): Promise<string> {
		return await bcrypt.hash(password, await bcrypt.genSalt());
	}

	async isValidPassword(password: string, hashedPassword: string): Promise<boolean> {
		return await bcrypt.compare(password, hashedPassword);
	}
}
