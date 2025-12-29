// WebSocket Gateway for Real-time Features
import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    ConnectedSocket,
    MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

@WebSocketGateway({
    cors: { origin: '*' },
    namespace: '/ws',
})
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private userSockets = new Map<string, string>(); // userId -> socketId

    constructor(
        private jwtService: JwtService,
        private prisma: PrismaService,
    ) { }

    async handleConnection(client: Socket) {
        try {
            const token = client.handshake.auth.token || client.handshake.headers.authorization?.split(' ')[1];

            if (!token) {
                client.disconnect();
                return;
            }

            const payload = this.jwtService.verify(token);
            const userId = payload.sub;

            // Store socket mapping
            this.userSockets.set(userId, client.id);
            (client as any).userId = userId;

            // Update user online status
            await this.prisma.user.update({
                where: { id: userId },
                data: { isOnline: true, lastSeen: new Date() },
            });

            // Join user's personal room
            client.join(`user:${userId}`);

            console.log(`User ${userId} connected`);
        } catch (error) {
            client.disconnect();
        }
    }

    async handleDisconnect(client: Socket) {
        const userId = (client as any).userId;

        if (userId) {
            this.userSockets.delete(userId);

            await this.prisma.user.update({
                where: { id: userId },
                data: { isOnline: false, lastSeen: new Date() },
            });

            console.log(`User ${userId} disconnected`);
        }
    }

    @SubscribeMessage('join_group')
    handleJoinGroup(@ConnectedSocket() client: Socket, @MessageBody() data: { groupId: string }) {
        client.join(`group:${data.groupId}`);
    }

    @SubscribeMessage('leave_group')
    handleLeaveGroup(@ConnectedSocket() client: Socket, @MessageBody() data: { groupId: string }) {
        client.leave(`group:${data.groupId}`);
    }

    @SubscribeMessage('send_message')
    async handleMessage(@ConnectedSocket() client: Socket, @MessageBody() data: any) {
        const userId = (client as any).userId;

        // Save message to database
        const message = await this.prisma.message.create({
            data: {
                senderId: userId,
                content: data.content,
                groupId: data.groupId,
                isGroupMessage: !!data.groupId,
            },
            include: {
                sender: { select: { id: true, name: true, avatar: true } },
            },
        });

        // Emit to group or private
        if (data.groupId) {
            this.server.to(`group:${data.groupId}`).emit('new_message', message);
        } else if (data.recipientId) {
            this.server.to(`user:${data.recipientId}`).emit('new_message', message);
            this.server.to(`user:${userId}`).emit('new_message', message);
        }
    }

    @SubscribeMessage('typing')
    handleTyping(@ConnectedSocket() client: Socket, @MessageBody() data: { groupId?: string; recipientId?: string }) {
        const userId = (client as any).userId;

        if (data.groupId) {
            client.to(`group:${data.groupId}`).emit('user_typing', { userId, groupId: data.groupId });
        } else if (data.recipientId) {
            this.server.to(`user:${data.recipientId}`).emit('user_typing', { userId });
        }
    }

    // Utility method to send notifications
    sendNotification(userId: string, notification: any) {
        this.server.to(`user:${userId}`).emit('notification', notification);
    }
}
