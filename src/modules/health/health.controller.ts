import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Coucou } from './dto/coucou.dto';
import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiCommonExceptionsDecorator } from '../../common/decorators/api-common-exceptions.decorator';

@Controller()
export class HealthController {
	@ApiOperation({
		summary: 'Health check endpoint',
		description: 'Returns a simple message to verify the service is running.',
	})
	@ApiResponse({ status: HttpStatus.OK, type: Coucou })
	@ApiCommonExceptionsDecorator()
	@Get('/coucou')
	@HttpCode(HttpStatus.OK)
	coucou(): Coucou {
		return {
			message: 'HELLO ❤️❤️❤️',
		};
	}
}
