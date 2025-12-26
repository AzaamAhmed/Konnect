import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import * as compression from 'compression';
import { AppModule } from './app.module';
import { Logger } from './common/logger/logger.service';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: new Logger(),
    });

    const configService = app.get(ConfigService);
    const port = configService.get('BACKEND_PORT') || 3001;

    // Security
    app.use(helmet());
    app.enableCors({
        origin: configService.get('CORS_ORIGIN')?.split(',') || ['http://localhost:3000'],
        credentials: true,
    });

    // Middleware
    app.use(cookieParser());
    app.use(compression());

    // Global validation pipe
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: true,
        }),
    );

    // API prefix
    app.setGlobalPrefix('api');

    // Swagger documentation
    const config = new DocumentBuilder()
        .setTitle('Konnect API')
        .setDescription('Startup Founders & University Collaboration Ecosystem API')
        .setVersion('1.0')
        .addBearerAuth()
        .addTag('auth', 'Authentication endpoints')
        .addTag('users', 'User management')
        .addTag('posts', 'Posts, ideas, and tasks')
        .addTag('groups', 'Community groups')
        .addTag('messages', 'Messaging and chat')
        .addTag('resources', 'University resources hub')
        .addTag('events', 'Event management')
        .addTag('search', 'Search and discovery')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    await app.listen(port);
    console.log(`🚀 Konnect Backend running on http://localhost:${port}`);
    console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
}

bootstrap();
