import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Video } from './video.entity';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Video])],
    providers: [VideoService],
    controllers: [VideoController],
    exports: [VideoService], // pour l'injecter dans PromptService
})
export class VideoModule {}
