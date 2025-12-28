import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class StorageService {
    private minioClient: Minio.Client;

    constructor(private configService: ConfigService) {
        const endpoint = configService.get('S3_ENDPOINT')?.replace('http://', '').replace('https://', '') || 'localhost:9000';

        this.minioClient = new Minio.Client({
            endPoint: endpoint.split(':')[0],
            port: parseInt(endpoint.split(':')[1]) || 9000,
            useSSL: configService.get('S3_USE_SSL') === 'true',
            accessKey: configService.get('S3_ACCESS_KEY') || 'konnect_minio',
            secretKey: configService.get('S3_SECRET_KEY') || 'konnect_minio_password',
        });
    }

    async uploadFile(file: Express.Multer.File, bucket: string = 'images'): Promise<string> {
        const fileName = `${uuidv4()}-${file.originalname}`;
        const metaData = {
            'Content-Type': file.mimetype,
        };

        try {
            await this.minioClient.putObject(bucket, fileName, file.buffer, file.size, metaData);

            // Return public URL
            const endpoint = this.configService.get('S3_ENDPOINT') || 'http://localhost:9000';
            return `${endpoint}/${bucket}/${fileName}`;
        } catch (error) {
            throw new BadRequestException(`File upload failed: ${error.message}`);
        }
    }

    async deleteFile(bucket: string, fileName: string): Promise<void> {
        try {
            await this.minioClient.removeObject(bucket, fileName);
        } catch (error) {
            throw new BadRequestException(`File deletion failed: ${error.message}`);
        }
    }

    async getFileUrl(bucket: string, fileName: string): Promise<string> {
        return await this.minioClient.presignedGetObject(bucket, fileName, 24 * 60 * 60); // 24 hours
    }
}
