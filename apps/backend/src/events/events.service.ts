import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class EventsService {
    constructor(private prisma: PrismaService) { }

    async create(data: Prisma.EventCreateInput, userId: string) {
        return this.prisma.event.create({
            data: {
                ...data,
                organizer: { connect: { id: userId } },
            },
            include: {
                organizer: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                    },
                },
            },
        });
    }

    async findAll(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.EventWhereUniqueInput;
        where?: Prisma.EventWhereInput;
        orderBy?: Prisma.EventOrderByWithRelationInput;
    }) {
        const { skip, take, cursor, where, orderBy } = params;
        return this.prisma.event.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
            include: {
                organizer: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                    },
                },
            },
        });
    }

    async findOne(id: string) {
        const event = await this.prisma.event.findUnique({
            where: { id },
            include: {
                organizer: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true,
                        email: true,
                    },
                },
            },
        });

        if (!event) {
            throw new NotFoundException(`Event with ID ${id} not found`);
        }

        return event;
    }

    async update(id: string, data: Prisma.EventUpdateInput) {
        return this.prisma.event.update({
            where: { id },
            data,
        });
    }

    async remove(id: string) {
        return this.prisma.event.delete({
            where: { id },
        });
    }
}
