import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { join } from 'path';
import { exec } from 'child_process';
import * as fs from 'fs';
import * as archiver from 'archiver';

@Injectable()
export class WebScraperService {
  private baseDir = join(process.cwd(), 'backend', 'uploads', 'web-scraper');

  async scrapeAndZip(url: string): Promise<string> {
    const id = randomUUID();
    const targetDir = join(this.baseDir, id);
    const zipPath = join(this.baseDir, `${id}.zip`);
    fs.mkdirSync(targetDir, { recursive: true });
    // Commande wget
    const wgetCmd = `wget --mirror --convert-links --adjust-extension --page-requisites --no-parent -P "${targetDir}" "${url}"`;
    await new Promise<void>((resolve, reject) => {
      exec(wgetCmd, (error, stdout, stderr) => {
        // Vérifie si le dossier contient des fichiers, même si wget retourne une erreur
        const hasFiles = fs.existsSync(targetDir) && fs.readdirSync(targetDir).length > 0;
        if (error && !hasFiles) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
    // Zippage
    await new Promise<void>((resolve, reject) => {
      const output = fs.createWriteStream(zipPath);
      const archive = archiver('zip', { zlib: { level: 9 } });
      output.on('close', resolve);
      archive.on('error', reject);
      archive.pipe(output);
      archive.directory(targetDir, false);
      archive.finalize();
    });
    return id;
  }

  async getZipFilePath(id: string): Promise<string | null> {
    const zipPath = join(this.baseDir, `${id}.zip`);
    if (fs.existsSync(zipPath)) return zipPath;
    return null;
  }
} 