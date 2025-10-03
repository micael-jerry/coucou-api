import {
	ConnectedSocket,
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { Message } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { ConversationEntity } from '../conversation/entity/conversation.entity';
import { JwtService } from '@nestjs/jwt';
import { AuthTokenPayload } from '../auth/payload/auth-token.payload';
import { Logger } from '@nestjs/common';

@WebSocketGateway(parseInt(process.env.SOCKET_PORT || '8081'), { cors: { origin: '*' } })
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	private readonly logger: Logger = new Logger(SocketGateway.name);

	@WebSocketServer()
	private readonly server: Server;

	private readonly connectedUsers = new Map<string, string>();

	constructor(private readonly jwtService: JwtService) {}

	afterInit() {
		this.logger.log('Socket server initialized');
	}

	handleConnection(client: Socket) {
		const authTokenPayload: AuthTokenPayload | null = this.getPayloadFromAuthHeader(
			client.handshake.headers.authorization,
		);
		if (!authTokenPayload) {
			client.disconnect(true);
			return;
		}
		this.connectedUsers.set(authTokenPayload.user_id, client.id);
		this.logger.log(`Client connected: ${client.id} (user: ${authTokenPayload.user_id})`);
	}

	handleDisconnect(@ConnectedSocket() client: Socket) {
		const authTokenPayload: AuthTokenPayload | null = this.getPayloadFromAuthHeader(
			client.handshake.headers.authorization,
		);
		if (authTokenPayload) {
			this.connectedUsers.delete(authTokenPayload.user_id);
		}
		this.logger.log(`Client disconnected: ${client.id}`);
	}

	@SubscribeMessage('joinConversation')
	async joinConversation(@MessageBody() conversationId: string, @ConnectedSocket() socket: Socket): Promise<void> {
		await socket.join(this.getConversationRoom(conversationId));
	}

	@SubscribeMessage('leaveConversation')
	async leaveConversation(@MessageBody() conversationId: string, @ConnectedSocket() socket: Socket): Promise<void> {
		await socket.leave(this.getConversationRoom(conversationId));
	}

	emitNewMessage(message: Message) {
		this.server.to(this.getConversationRoom(message.conversation_id)).emit('newMessage', message);
	}

	emitNewConversation(conversation: ConversationEntity) {
		conversation.members.forEach((member) => {
			const socketId = this.connectedUsers.get(member.user.id);
			if (socketId) {
				this.server.to(socketId).emit('newConversation', conversation);
			}
		});
	}

	private getConversationRoom(conversationId: string): string {
		return `conversation:${conversationId}`;
	}

	private getPayloadFromAuthHeader(authHeader: string | undefined): AuthTokenPayload | null {
		if (!authHeader) return null;
		try {
			const token = authHeader.split(' ')[1];
			return this.jwtService.verify<AuthTokenPayload>(token);
		} catch (err) {
			this.logger.error('Invalid token', err);
			return null;
		}
	}
}
