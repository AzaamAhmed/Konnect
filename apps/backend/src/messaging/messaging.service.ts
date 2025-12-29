import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MessagingService {
    constructor(private prisma: PrismaService) { }

    async getConversations(userId: string) {
        return this.prisma.message.findMany({
            where: {
                OR: [{ senderId: userId }, { group: { members: { some: { userId } } } }],
            },
            include: {
                sender: { select: { id: true, name: true, avatar: true } },
                group: { select: { id: true, name: true, avatar: true } },
            },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });
    }

    async getMessages(groupId?: string, userId?: string) {
        return this.prisma.message.findMany({
            where: groupId ? { groupId } : { senderId: userId },
            include: {
                sender: { select: { id: true, name: true, avatar: true } },
            },
            orderBy: { createdAt: 'asc' },
        });
    }
}
