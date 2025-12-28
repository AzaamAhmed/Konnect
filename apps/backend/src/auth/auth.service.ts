import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { RegisterDto, LoginDto } from './dto';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private usersService: UsersService,
        private configService: ConfigService,
    ) { }

    async register(registerDto: RegisterDto) {
        const { email, password, name, role } = registerDto;

        // Check if user exists
        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new BadRequestException('User already exists');
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create user
        const user = await this.prisma.user.create({
            data: {
                email,
                passwordHash,
                name,
                role: role || 'DEVELOPER',
            },
        });

        // Generate tokens
        const { accessToken, refreshToken } = await this.generateTokens(user.id, user.email);

        return {
            user: this.excludePassword(user),
            accessToken,
            refreshToken,
        };
    }

    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;

        // Find user
        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!user || !user.passwordHash) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Update last seen
        await this.prisma.user.update({
            where: { id: user.id },
            data: { lastSeen: new Date(), isOnline: true },
        });

        // Generate tokens
        const { accessToken, refreshToken } = await this.generateTokens(user.id, user.email);

        return {
            user: this.excludePassword(user),
            accessToken,
            refreshToken,
        };
    }

    async googleLogin(profile: any) {
        let user = await this.prisma.user.findUnique({
            where: { googleId: profile.id },
        });

        if (!user) {
            // Check if user with this email exists
            user = await this.prisma.user.findUnique({
                where: { email: profile.emails[0].value },
            });

            if (user) {
                // Link Google account
                user = await this.prisma.user.update({
                    where: { id: user.id },
                    data: { googleId: profile.id },
                });
            } else {
                // Create new user
                user = await this.prisma.user.create({
                    data: {
                        email: profile.emails[0].value,
                        googleId: profile.id,
                        name: profile.displayName,
                        avatar: profile.photos?.[0]?.value,
                        emailVerified: true,
                    },
                });
            }
        }

        const { accessToken, refreshToken } = await this.generateTokens(user.id, user.email);

        return {
            user: this.excludePassword(user),
            accessToken,
            refreshToken,
        };
    }

    async githubLogin(profile: any) {
        let user = await this.prisma.user.findUnique({
            where: { githubId: profile.id },
        });

        if (!user) {
            user = await this.prisma.user.findUnique({
                where: { email: profile.emails?.[0]?.value },
            });

            if (user) {
                user = await this.prisma.user.update({
                    where: { id: user.id },
                    data: { githubId: profile.id },
                });
            } else {
                user = await this.prisma.user.create({
                    data: {
                        email: profile.emails?.[0]?.value || `${profile.username}@github.local`,
                        githubId: profile.id,
                        name: profile.displayName || profile.username,
                        avatar: profile.photos?.[0]?.value,
                        username: profile.username,
                        emailVerified: !!profile.emails?.[0]?.value,
                    },
                });
            }
        }

        const { accessToken, refreshToken } = await this.generateTokens(user.id, user.email);

        return {
            user: this.excludePassword(user),
            accessToken,
            refreshToken,
        };
    }

    async validateUser(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        return this.excludePassword(user);
    }

    private async generateTokens(userId: string, email: string) {
        const payload = { sub: userId, email };

        const accessToken = this.jwtService.sign(payload);
        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_REFRESH_SECRET'),
            expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION') || '30d',
        });

        return { accessToken, refreshToken };
    }

    private excludePassword(user: any) {
        const { passwordHash, ...result } = user;
        return result;
    }
}
