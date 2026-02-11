import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../../modules/auth/auth.service';
import { User } from '../../../prisma/generated/client';
import { AuthTokenPayload } from '../payloads/auth-token.payload';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly configService: ConfigService,
		private readonly authService: AuthService,
	) {
		super({
			clientID: configService.get<string>('app.google.clientId')!,
			clientSecret: configService.get<string>('app.google.clientSecret')!,
			callbackURL: configService.get<string>('app.google.redirectUri')!,
			scope: ['email', 'profile'],
		});
	}

	async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback): Promise<void> {
		const user: User = await this.authService.signInWithGoogle(profile);
		const authTokenPayload: AuthTokenPayload = {
			user_id: user.id,
			user_username: user.username,
			user_role: user.role,
		};
		done(null, authTokenPayload);
	}
}
