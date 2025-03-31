import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';

@Controller({ path: '/auth' })
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('/sign-up')
	signUp(@Body() signUpDto: SignUpDto) {
		return signUpDto;
	}

	@Get('/sign-in')
	signIn() {}
}
