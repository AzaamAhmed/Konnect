import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
    constructor(private prisma: PrismaService) { }

    async getDashboardStats() {
        const [userCount, postCount, groupCount, eventCount] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.post.count(),
            this.prisma.group.count(),
            this.prisma.event.count(),
        ]);

        const usersByRole = await this.prisma.user.groupBy({
            by: ['role'],
            _count: {
                role: true,
            },
        });

        return {
            overview: {
                totalUsers: userCount,
                totalPosts: postCount,
                totalGroups: groupCount,
                totalEvents: eventCount,
            },
            userDistribution: usersByRole.reduce((acc, curr) => {
                acc[curr.role] = curr._count.role;
                return acc;
            }, {}),
        };
    }

    async getAllUsers(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.user.count(),
        ]);

        return {
            data: users,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async verifyUser(userId: string) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { studentIdVerified: true },
        });
    }

    async deleteUser(userId: string) {
        return this.prisma.user.delete({
            where: { id: userId },
        });
    }
}
