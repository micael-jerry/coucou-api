import { WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway(8081)
export class AppGateway {}
