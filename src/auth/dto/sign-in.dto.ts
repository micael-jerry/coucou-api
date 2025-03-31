import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class SignInDto {
	@ApiProperty({ minimum: 5 })
	@IsNotEmpty()
	@MinLength(5)
	username: string;

	@ApiProperty({ minimum: 8, maximum: 50 })
	@IsNotEmpty()
	@MinLength(8)
	@MaxLength(50)
	password: string;
}
