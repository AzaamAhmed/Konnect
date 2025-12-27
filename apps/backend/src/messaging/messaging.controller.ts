import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { MessagingService } from './messaging.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('messages')
@Controller('messages')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MessagingController {
    constructor(private messagingService: MessagingService) { }

    @Get('conversations')
    async getConversations(@Req() req) {
        return this.messagingService.getConversations(req.user.id);
    }

    @Get()
    async getMessages(@Query('groupId') groupId?: string, @Query('userId') userId?: string) {
        return this.messagingService.getMessages(groupId, userId);
    }
}
