import { Controller, Get, Post, UploadedFile, UseInterceptors, Body, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { VideoService } from './video.service';
import { extname } from 'path';

@Controller('videos')
export class VideoController {
    constructor(private readonly videoService: VideoService) {}

    @Post('upload')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads/videos',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
            },
        }),
    }))
    async uploadVideo(
        @UploadedFile() file: Express.Multer.File,
        @Query('userId') userId: number,
        @Query('promptId') promptId: number,
    ) {
        const filePath = file.path;
        return this.videoService.saveVideo(userId, promptId, filePath);
    }

    @Get()
    async getAll() {
        return this.videoService.findAll();
    }
}
