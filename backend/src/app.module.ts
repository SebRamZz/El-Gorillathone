import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PromptModule } from './prompt/prompt.module';
import { VideoModule } from './video/video.module';
import { Prompt } from './prompt/prompt.entity';
import { Video } from './video/video.entity';
import {UserModule} from "./user/user.module";
import {AuthModule} from "./auth/auth.module";
import {UserEntity} from "./user/user.entity";
import { WebScraperModule } from './web-scraper/web-scraper.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres',
      port: 5432,
      username: 'veo_user',
      password: 'veo_pass',
      database: 'veo_db',
      entities: [Prompt, Video, UserEntity],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    PromptModule,
    VideoModule,
    WebScraperModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
