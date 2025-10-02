import {
	ConnectedSocket,
	MessageBody,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketService } from './socket/socket.service';

@WebSocketGateway(8081)
export class AppGateway implements OnGatewayInit {
	@WebSocketServer()
	private readonly server: Server;

	constructor(private socketService: SocketService) {}

	afterInit() {
		this.socketService.setServer(this.server);
	}

	@SubscribeMessage('test')
	sendMessage(@MessageBody() data: string, @ConnectedSocket() socket: Socket) {
		console.log(data);
		socket.emit('test', data);
	}
}
