import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Video } from './video.entity';

@Injectable()
export class VideoService {
    constructor(
        @InjectRepository(Video)
        private videoRepo: Repository<Video>,
    ) {}

    async saveVideo(userId: number, filePath: string): Promise<Video> {
        const video = this.videoRepo.create({ userId, filePath });
        return this.videoRepo.save(video);
    }

    async findAll(): Promise<Video[]> {
        return this.videoRepo.find();
    }
}
