import { Controller, Get, Post, Param, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { GroupsService } from './groups.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('groups')
@Controller('groups')
export class GroupsController {
    constructor(private groupsService: GroupsService) { }

    @Get()
    async findAll() {
        return this.groupsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.groupsService.findOne(id);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async create(@Body() data: any) {
        return this.groupsService.create(data);
    }

    @Post(':id/join')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async joinGroup(@Req() req, @Param('id') groupId: string) {
        return this.groupsService.joinGroup(req.user.id, groupId);
    }
}
