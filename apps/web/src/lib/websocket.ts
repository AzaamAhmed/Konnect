import { io, Socket } from 'socket.io-client';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001';

class WebSocketClient {
    private socket: Socket | null = null;

    connect(token: string) {
        if (this.socket?.connected) return this.socket;

        this.socket = io(`${WS_URL}/ws`, {
            auth: { token },
            transports: ['websocket'],
        });

        this.socket.on('connect', () => {
            console.log('✅ WebSocket connected');
        });

        this.socket.on('disconnect', () => {
            console.log('❌ WebSocket disconnected');
        });

        this.socket.on('error', (error) => {
            console.error('WebSocket error:', error);
        });

        return this.socket;
    }

    disconnect() {
        this.socket?.disconnect();
        this.socket = null;
    }

    // Join group
    joinGroup(groupId: string) {
        this.socket?.emit('join_group', { groupId });
    }

    leaveGroup(groupId: string) {
        this.socket?.emit('leave_group', { groupId });
    }

    // Send message
    sendMessage(data: { content: string; groupId?: string; recipientId?: string }) {
        this.socket?.emit('send_message', data);
    }

    // Typing indicator
    sendTyping(data: { groupId?: string; recipientId?: string }) {
        this.socket?.emit('typing', data);
    }

    // Listen for new messages
    onMessage(callback: (message: any) => void) {
        this.socket?.on('new_message', callback);
    }

    // Listen for typing
    onTyping(callback: (data: any) => void) {
        this.socket?.on('user_typing', callback);
    }

    // Listen for notifications
    onNotification(callback: (notification: any) => void) {
        this.socket?.on('notification', callback);
    }

    // Remove listeners
    off(event: string, callback?: any) {
        this.socket?.off(event, callback);
    }

    getSocket() {
        return this.socket;
    }
}

export const wsClient = new WebSocketClient();
