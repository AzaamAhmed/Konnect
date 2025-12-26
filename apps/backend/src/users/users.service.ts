import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findById(id: string) {
        return this.prisma.user.findUnique({
            where: { id },
            include: {
                followers: { include: { follower: { select: { id: true, name: true, avatar: true } } } },
                following: { include: { following: { select: { id: true, name: true, avatar: true } } } },
            },
        });
    }

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({ where: { email } });
    }

    async updateProfile(userId: string, data: any) {
        return this.prisma.user.update({
            where: { id: userId },
            data,
        });
    }

    async searchUsers(query: string, filters?: any) {
        return this.prisma.user.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { bio: { contains: query, mode: 'insensitive' } },
                    { skills: { hasSome: [query] } },
                ],
                ...(filters?.role && { role: filters.role }),
                ...(filters?.city && { city: filters.city }),
            },
            take: 20,
        });
    }

    async getNearbyUsers(latitude: number, longitude: number, radiusKm: number = 50) {
        // Simple distance calculation using Haversine formula in raw SQL
        return this.prisma.$queryRaw`
      SELECT * FROM users
      WHERE latitude IS NOT NULL AND longitude IS NOT NULL
      AND (
        6371 * acos(
          cos(radians(${latitude})) * cos(radians(latitude)) *
          cos(radians(longitude) - radians(${longitude})) +
          sin(radians(${latitude})) * sin(radians(latitude))
        )
      ) <= ${radiusKm}
      LIMIT 50
    `;
    }
}
