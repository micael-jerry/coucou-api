import { ApiProperty } from '@nestjs/swagger';

export class Coucou {
	@ApiProperty()
	message: string;
}
