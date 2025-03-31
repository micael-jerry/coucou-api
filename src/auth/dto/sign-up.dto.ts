import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class SignUpDto {
	@IsNotEmpty()
	username: string;

	@IsEmail()
	email: string;

	@IsNotEmpty()
	@MinLength(8)
	@MaxLength(50)
	password: string;

	@IsNotEmpty()
	firstname: string;

	@IsNotEmpty()
	lastname: string;
}
