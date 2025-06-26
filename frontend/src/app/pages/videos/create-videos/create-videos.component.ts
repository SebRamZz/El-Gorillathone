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
  isLoading = false;
  successMessage = '';

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

  get modelPrice(): number {
    if (this.form.model === 'veo-3.0-generate-preview') {
      return 20;
    }
    return 10;
  }

  onSubmit() {
    this.isLoading = true;
    this.successMessage = '';

    setTimeout(() => {
      this.isLoading = false;
      this.successMessage = 'Vidéo générée avec succès ! Retournez sur la liste des vidéos pour la retrouver.';
    }, 3000);

    this.videoService.generateVideo(
      this.form.message,
      this.form.model,
      this.form.aspectRatio,
      this.form.personGeneration,
      this.form.numberOfVideos,
      this.form.durationSeconds,
      this.userId || '',
    ).subscribe({
      error: (err) => {
        console.error('Erreur lors de la génération de la vidéo', err);
      }
    });
  }
}