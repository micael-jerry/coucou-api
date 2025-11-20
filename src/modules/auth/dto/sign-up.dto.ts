import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class SignUpDto {
	@ApiProperty({ minimum: 5 })
	@IsNotEmpty()
	@MinLength(5)
	username: string;

	@ApiProperty()
	@IsEmail()
	email: string;

	@ApiProperty({
		minLength: 8,
		maxLength: 50,
	})
	@IsNotEmpty()
	@MinLength(8)
	@MaxLength(50)
	password: string;

	@ApiProperty()
	@IsNotEmpty()
	firstname: string;

	@ApiProperty()
	@IsNotEmpty()
	lastname: string;
}
