import { Controller, Get, Post, UploadedFile, UseInterceptors, Body, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { VideoService } from './video.service';
import { extname } from 'path';
import { Express } from 'express';

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
    ) {
        const userId = 1;
        console.log('Jai recu un appel du back avec toutes les infos', file, userId);
        const filePath = file.path;
        return this.videoService.saveVideo(userId, filePath);
    }

    @Get()
    async getAll() {
        return this.videoService.findAll();
    }
}
