import { Server } from 'socket.io';

export class SocketService {
	private server: Server;

	getServer(): Server {
		return this.server;
	}

	setServer(server: Server) {
		this.server = server;
	}
}
