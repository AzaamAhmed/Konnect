import { Controller, Get, Delete, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
// import { RolesGuard } from '../auth/guards/roles.guard'; // Assuming you implement roles guard later

@ApiTags('admin')
@Controller('admin')
// @UseGuards(JwtAuthGuard, RolesGuard) // In production, add Role guard 
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Get('stats')
    @ApiOperation({ summary: 'Get dashboard statistics' })
    getStats() {
        return this.adminService.getDashboardStats();
    }

    @Get('users')
    @ApiOperation({ summary: 'Get all users' })
    getAllUsers(@Query('page') page: number, @Query('limit') limit: number) {
        return this.adminService.getAllUsers(Number(page) || 1, Number(limit) || 10);
    }

    @Patch('users/:id/verify')
    @ApiOperation({ summary: 'Verify user student status' })
    verifyUser(@Param('id') id: string) {
        return this.adminService.verifyUser(id);
    }

    @Delete('users/:id')
    @ApiOperation({ summary: 'Delete user' })
    deleteUser(@Param('id') id: string) {
        return this.adminService.deleteUser(id);
    }
}
