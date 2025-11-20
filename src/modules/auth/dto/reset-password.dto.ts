import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, IsJWT } from 'class-validator';

export class ResetPasswordDto {
	@ApiProperty({ description: 'The password reset token from the email.' })
	@IsJWT({ message: 'Invalid token' })
	token: string;

	@ApiProperty({
		minLength: 8,
		maxLength: 50,
	})
	@IsNotEmpty()
	@MinLength(8)
	@MaxLength(50)
	newPassword: string;
}
