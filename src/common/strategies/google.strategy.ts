import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly configService: ConfigService) {
		super({
			clientID: configService.get<string>('app.google.clientId')!,
			clientSecret: configService.get<string>('app.google.clientSecret')!,
			callbackURL: configService.get<string>('app.google.redirectUri')!,
			scope: ['email', 'profile'],
		});
	}

	validate(...args: any[]): void {
		console.log(args);
	}
}
