import { Global, Module } from '@nestjs/common';
import { SocketService } from './socket.service';
import { AuthModule } from '../auth/auth.module';

@Global()
@Module({
	imports: [AuthModule],
	providers: [SocketService],
	exports: [SocketService],
})
export class SocketModule {}
