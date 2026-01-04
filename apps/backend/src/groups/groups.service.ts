import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GroupsService {
    constructor(private prisma: PrismaService) { }

    async create(data: any) {
        return this.prisma.group.create({ data });
    }

    async findAll() {
        return this.prisma.group.findMany({
            include: { _count: { select: { members: true } } },
            orderBy: { memberCount: 'desc' },
        });
    }

    async findOne(id: string) {
        return this.prisma.group.findUnique({
            where: { id },
            include: {
                members: {
                    include: { user: { select: { id: true, name: true, avatar: true } } },
                },
            },
        });
    }

    async joinGroup(userId: string, groupId: string, role: string = 'member') {
        return this.prisma.groupMember.create({
            data: { userId, groupId, role },
        });
    }
}
