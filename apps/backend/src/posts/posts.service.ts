import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PostsService {
    constructor(private prisma: PrismaService) { }

    async create(authorId: string, data: any) {
        return this.prisma.post.create({
            data: {
                ...data,
                authorId,
            },
            include: {
                author: { select: { id: true, name: true, avatar: true, role: true } },
            },
        });
    }

    async findAll(filters?: any, page: number = 1, limit: number = 20) {
        const where: any = { isActive: true };

        if (filters?.type) where.type = filters.type;
        if (filters?.category) where.category = filters.category;
        if (filters?.city) where.city = filters.city;
        if (filters?.fundingStage) where.fundingStage = filters.fundingStage;
        if (filters?.isPaid !== undefined) where.isPaid = filters.isPaid === 'true';

        const [posts, total] = await Promise.all([
            this.prisma.post.findMany({
                where,
                include: {
                    author: { select: { id: true, name: true, avatar: true, role: true } },
                    _count: { select: { comments: true, reactions: true, applications: true } },
                },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.post.count({ where }),
        ]);

        return {
            posts,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: string) {
        // Increment view count
        await this.prisma.post.update({
            where: { id },
            data: { viewCount: { increment: 1 } },
        });

        return this.prisma.post.findUnique({
            where: { id },
            include: {
                author: true,
                comments: {
                    include: {
                        author: { select: { id: true, name: true, avatar: true } },
                        reactions: true,
                    },
                    orderBy: { createdAt: 'desc' },
                },
                reactions: {
                    include: {
                        user: { select: { id: true, name: true } },
                    },
                },
                applications: {
                    include: {
                        user: { select: { id: true, name: true, avatar: true } },
                    },
                },
            },
        });
    }

    async apply(userId: string, postId: string, message: string) {
        return this.prisma.application.create({
            data: {
                userId,
                postId,
                message,
            },
        });
    }

    async addComment(userId: string, postId: string, content: string, parentId?: string) {
        return this.prisma.comment.create({
            data: {
                authorId: userId,
                postId,
                content,
                parentId,
            },
            include: {
                author: { select: { id: true, name: true, avatar: true } },
            },
        });
    }

    async addReaction(userId: string, postId: string, type: string) {
        return this.prisma.reaction.create({
            data: {
                userId,
                postId,
                type,
            },
        });
    }

    async bookmark(userId: string, postId: string) {
        return this.prisma.bookmark.create({
            data: {
                userId,
                postId,
            },
        });
    }
}
