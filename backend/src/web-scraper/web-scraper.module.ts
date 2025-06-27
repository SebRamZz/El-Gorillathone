import { Module } from '@nestjs/common';
import { WebScraperController } from './web-scraper.controller';
import { WebScraperService } from './web-scraper.service';

@Module({
  controllers: [WebScraperController],
  providers: [WebScraperService],
})
export class WebScraperModule {} 