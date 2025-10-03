import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { JwtModule } from '@nestjs/jwt';

@Module({
	imports: [JwtModule],
	providers: [SocketGateway],
	exports: [SocketGateway],
})
export class SocketModule {}
