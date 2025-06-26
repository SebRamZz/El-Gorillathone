import { Controller, Post, Body, Res, Get, Param, HttpException, HttpStatus } from '@nestjs/common';
import { WebScraperService } from './web-scraper.service';
import { Response } from 'express';

@Controller('web-scraper')
export class WebScraperController {
  constructor(private readonly webScraperService: WebScraperService) {}

  @Post()
  async scrape(@Body('url') url: string) {
    if (!url) throw new HttpException('URL requise', HttpStatus.BAD_REQUEST);
    const id = await this.webScraperService.scrapeAndZip(url);
    return { id };
  }

  @Get('download/:id')
  async download(@Param('id') id: string, @Res() res: Response) {
    const file = await this.webScraperService.getZipFilePath(id);
    if (!file) throw new HttpException('Fichier non trouvé', HttpStatus.NOT_FOUND);
    res.download(file, `site-${id}.zip`);
  }
} 