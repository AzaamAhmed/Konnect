import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { GroupsModule } from './groups/groups.module';
import { MessagingModule } from './messaging/messaging.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ResourcesModule } from './resources/resources.module';
import { EventsModule } from './events/events.module';
import { StorageModule } from './storage/storage.module';
import { WebsocketModule } from './websocket/websocket.module';
import { SearchModule } from './search/search.module';
import { PaymentsModule } from './payments/payments.module';
import { AdminModule } from './admin/admin.module';
import { LoggerModule } from './common/logger/logger.module';

@Module({
    imports: [
        // Configuration
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),

        // Rate limiting
        ThrottlerModule.forRoot([{
            ttl: 60000, // 1 minute
            limit: 100, // 100 requests per minute
        }]),

        // Core modules
        LoggerModule,
        PrismaModule,

        // Feature modules
        AuthModule,
        UsersModule,
        PostsModule,
        GroupsModule,
        MessagingModule,
        NotificationsModule,
        ResourcesModule,
        EventsModule,
        StorageModule,
        AdminModule,
        WebsocketModule,
        SearchModule,
        PaymentsModule,
    ],
})
export class AppModule { }
