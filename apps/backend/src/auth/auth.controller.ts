import { Controller, Post, Body, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post('login')
    @ApiOperation({ summary: 'Login with email and password' })
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Get('google')
    @UseGuards(AuthGuard('google'))
    @ApiOperation({ summary: 'Login with Google OAuth' })
    async googleAuth() {
        // Initiates Google OAuth flow
    }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthCallback(@Req() req, @Res() res: Response) {
        const result = await this.authService.googleLogin(req.user);

        // Redirect to frontend with tokens
        const frontendUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        res.redirect(`${frontendUrl}/auth/callback?token=${result.accessToken}`);
    }

    @Get('github')
    @UseGuards(AuthGuard('github'))
    @ApiOperation({ summary: 'Login with GitHub OAuth' })
    async githubAuth() {
        // Initiates GitHub OAuth flow
    }

    @Get('github/callback')
    @UseGuards(AuthGuard('github'))
    async githubAuthCallback(@Req() req, @Res() res: Response) {
        const result = await this.authService.githubLogin(req.user);

        const frontendUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        res.redirect(`${frontendUrl}/auth/callback?token=${result.accessToken}`);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get current user' })
    async getMe(@Req() req) {
        return req.user;
    }
}
