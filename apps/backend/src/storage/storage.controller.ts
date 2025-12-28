import { Controller, Post, UploadedFile, UseInterceptors, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { StorageService } from './storage.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('storage')
@Controller('storage')
export class StorageController {
    constructor(private storageService: StorageService) { }

    @Post('upload/avatar')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: { type: 'string', format: 'binary' },
            },
        },
    })
    async uploadAvatar(@UploadedFile() file: Express.Multer.File) {
        const url = await this.storageService.uploadFile(file, 'avatars');
        return { url };
    }

    @Post('upload/document')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    async uploadDocument(@UploadedFile() file: Express.Multer.File) {
        const url = await this.storageService.uploadFile(file, 'documents');
        return { url };
    }

    @Post('upload/image')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    async uploadImage(@UploadedFile() file: Express.Multer.File) {
        const url = await this.storageService.uploadFile(file, 'images');
        return { url };
    }
}
