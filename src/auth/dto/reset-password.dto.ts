import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class ResetPasswordDto {
	@ApiProperty({
		minLength: 8,
		maxLength: 50,
	})
	@IsNotEmpty()
	@MinLength(8)
	@MaxLength(50)
	newPassword: string;
}
