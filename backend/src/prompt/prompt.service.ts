import {Video} from "../video/video.entity";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {Prompt} from "./prompt.entity";
import {Injectable} from "@nestjs/common";
import {CreatePromptDto} from "./dto/create-prompt.dto";

@Injectable()
export class PromptService {
    constructor(
        @InjectRepository(Prompt)
        private promptRepo: Repository<Prompt>,
        @InjectRepository(Video)
        private videoRepo: Repository<Video>,
    ) {}

    async createPromptWithVideoFromFields(fields: CreatePromptDto): Promise<Video> {
        const promptText = this.generatePromptText(fields);

        const prompt = this.promptRepo.create({
            userId: fields.userId,
            text: promptText,
        });
        await this.promptRepo.save(prompt);

        const videoPath = await this.generateVideoFromPrompt(promptText, prompt.id);

        const video = this.videoRepo.create({
            userId: fields.userId,
            filePath: videoPath,
        });

        return this.videoRepo.save(video);
    }

    private generatePromptText(fields: CreatePromptDto): string {
        return `Créer une vidéo de ${fields.duration} dans un format ${fields.format} avec une qualité ${fields.quality},
         représentant ${fields.numberOfCharacters} personnage(s) de type ${fields.characterType} portant ${fields.outfit},
          situé à ${fields.location}, dans un contexte ${fields.context}. 
          Le(s) personnage(s) ont une personnalité ${fields.personality} et effectuent l'action suivante : ${fields.action}.`;
    }

    // 🧪 Simulation IA
    private async generateVideoFromPrompt(prompt: string, promptId: number): Promise<string> {
        const fs = await import('fs/promises');
        const filePath = `uploads/videos/generated-${promptId}.mp4`;
        await fs.writeFile(filePath, 'SIMULATED_VIDEO_BINARY_DATA');
        return filePath;
    }
}
