import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ResetPasswordRequestDto {
	@IsEmail({}, { message: 'Invalid email' })
	@ApiProperty()
	email: string;
}
