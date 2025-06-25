import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prompt } from './prompt.entity';
import { Video } from '../video/video.entity';
import { CreatePromptDto } from './dto/create-prompt.dto';
import { gorillAgent } from '../agent/agent';

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

    const videoPathOrError = await this.invokeAgentForVideo(promptText);

    if (videoPathOrError.startsWith('❌')) {
      throw new Error(videoPathOrError);
    }

    const video = this.videoRepo.create({
      userId: fields.userId,
      promptId: prompt.id,
      filePath: videoPathOrError,
    });

    return this.videoRepo.save(video);
  }

  private generatePromptText(fields: CreatePromptDto): string {
    return `Créer une vidéo de ${fields.duration} dans un format ${fields.format} avec une qualité ${fields.quality},
    représentant ${fields.numberOfCharacters} personnage(s) de type ${fields.characterType} portant ${fields.outfit},
    situé à ${fields.location}, dans un contexte ${fields.context}. 
    Le(s) personnage(s) ont une personnalité ${fields.personality} et effectuent l'action suivante : ${fields.action}.`;
  }

  private async invokeAgentForVideo(promptText: string): Promise<string> {
    try {
      const resultState = await gorillAgent.invoke({
        messages: [
          {
            role: 'user',
            content: promptText,
          },
        ],
      });

      if (typeof resultState === 'string') {
        return resultState;
      }

      if ('output' in resultState && typeof resultState.output === 'string') {
        return resultState.output;
      }

      return '❌ L\'agent n\'a pas retourné de réponse valide.';
    } catch (err) {
      console.error('Erreur lors de l’appel à l’agent IA:', err);
      return '❌ Erreur lors de la génération vidéo.';
    }
  }
}
