import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {PromptService} from "./prompt.service";
import {PromptController} from "./prompt.controller";
import {Video} from "../video/video.entity";
import {Prompt} from "./prompt.entity";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [
        TypeOrmModule.forFeature([Prompt, Video]),
        ConfigModule,
    ],
    providers: [PromptService],
    controllers: [PromptController],
})
export class PromptModule {}
