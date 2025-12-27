import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Query,
    Request,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

@ApiTags('events')
@Controller('events')
export class EventsController {
    constructor(private readonly eventsService: EventsService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new event' })
    create(@Body() createEventDto: any, @Request() req) {
        // Ensuring basic validation via CreateInput type in service
        return this.eventsService.create(createEventDto, req.user.id);
    }

    @Get()
    @ApiOperation({ summary: 'Get all events' })
    findAll(@Query() query) {
        const { page = 1, limit = 10, category, isOnline } = query;
        const skip = (page - 1) * limit;

        const where: Prisma.EventWhereInput = {};
        if (category) where.category = category;
        if (isOnline !== undefined) where.isOnline = isOnline === 'true';

        return this.eventsService.findAll({
            skip,
            take: Number(limit),
            where,
            orderBy: { startDate: 'asc' },
        });
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get event by id' })
    findOne(@Param('id') id: string) {
        return this.eventsService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update event' })
    update(@Param('id') id: string, @Body() updateEventDto: any) {
        return this.eventsService.update(id, updateEventDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete event' })
    remove(@Param('id') id: string) {
        return this.eventsService.remove(id);
    }
}
