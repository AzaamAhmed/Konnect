import { Controller, Get, Put, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Get('search')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async searchUsers(@Query('q') query: string, @Query() filters: any) {
        return this.usersService.searchUsers(query, filters);
    }

    @Get('nearby')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async getNearbyUsers(
        @Query('lat') lat: number,
        @Query('lng') lng: number,
        @Query('radius') radius?: number,
    ) {
        return this.usersService.getNearbyUsers(lat, lng, radius);
    }

    @Get(':id')
    async getUserById(@Param('id') id: string) {
        return this.usersService.findById(id);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async updateProfile(@Param('id') id: string, @Body() data: any) {
        return this.usersService.updateProfile(id, data);
    }
}
