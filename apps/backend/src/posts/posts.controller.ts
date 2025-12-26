import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
    constructor(private postsService: PostsService) { }

    @Get()
    async findAll(@Query() filters: any, @Query('page') page?: number) {
        return this.postsService.findAll(filters, page);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.postsService.findOne(id);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async create(@Req() req, @Body() data: any) {
        return this.postsService.create(req.user.id, data);
    }

    @Post(':id/apply')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async apply(@Req() req, @Param('id') postId: string, @Body('message') message: string) {
        return this.postsService.apply(req.user.id, postId, message);
    }

    @Post(':id/comments')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async addComment(@Req() req, @Param('id') postId: string, @Body() data: any) {
        return this.postsService.addComment(req.user.id, postId, data.content, data.parentId);
    }

    @Post(':id/reactions')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async addReaction(@Req() req, @Param('id') postId: string, @Body('type') type: string) {
        return this.postsService.addReaction(req.user.id, postId, type);
    }

    @Post(':id/bookmark')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    async bookmark(@Req() req, @Param('id') postId: string) {
        return this.postsService.bookmark(req.user.id, postId);
    }
}
