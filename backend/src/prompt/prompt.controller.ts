import { Body, Controller, Post } from '@nestjs/common';
import { PromptService } from './prompt.service';
import { CreatePromptDto } from './dto/create-prompt.dto';

@Controller('prompts')
export class PromptController {
    constructor(private readonly promptService: PromptService) {}

    @Post()
    async create(@Body() dto: CreatePromptDto) {
        const video = await this.promptService.createPromptWithVideoFromFields(dto);
        return {
            message: 'Vidéo générée à partir du formulaire.',
            video,
        };
    }
}
