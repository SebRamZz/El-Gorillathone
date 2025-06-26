import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, RouterLink } from '@angular/router';
import { VideoService } from '../../../services/video.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-create-videos',
  templateUrl: './create-videos.component.html',
  styleUrls: ['./create-videos.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, FormsModule]
})
export class CreateVideosComponent implements OnInit {
  form: any = {
    message: '',
    model: 'veo-2.0-generate-001',
    aspectRatio: '16:9',
    personGeneration: 'dont_allow',
    numberOfVideos: 1,
    durationSeconds: 8,
  };
  userId: string | null = null;

  constructor(
    private videoService: VideoService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userId = user.id;
    } else {
      console.error('Utilisateur non connecté');
    }
  }

  onSubmit() {
    this.videoService.generateVideo(
      this.form.message,
      this.form.model,
      this.form.aspectRatio,
      this.form.personGeneration,
      this.form.numberOfVideos,
      this.form.durationSeconds,
      this.userId || '',
    ).subscribe({
      next: (res) => {
        console.log('Vidéo générée :', res);
      },
      error: (err) => {
        console.error('Erreur génération vidéo :', err);
      }
    });
  }
}