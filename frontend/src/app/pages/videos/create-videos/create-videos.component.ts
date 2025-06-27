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
  step = 1;

  characterOptions = [
  'Enfant', 'Vieillard', 'Super-héros', 'Chat', 'Chien', 'Robot', 'Alien', 'Princesse', 'Pirate', 'Chevalier',
  'Magicien', 'Vampire', 'Zombie', 'Samouraï', 'Ninja', 'Scientifique', 'Explorateur', 'Athlète', 'Artiste', 'Président'
];

actionOptions = [
  'Court', 'Danse', 'Chante', 'Lit', 'Cuisine', 'Joue au football', 'Fait du vélo', 'Nage', 'Vole', 'Se bat',
  'Rit', 'Pleure', 'Fait un discours', 'Dort', 'Écrit', 'Dessine', 'Fait du skate', 'Fait du yoga', 'Joue de la guitare', 'Fait un selfie'
];

locationOptions = [
  'Forêt', 'Plage', 'Ville', 'Montagne', 'Désert', 'Espace', 'Sous-marin', 'Château', 'École', 'Stade',
  'Musée', 'Café', 'Parc', 'Île tropicale', 'Bateau', 'Train', 'Avion', 'Bibliothèque', 'Marché', 'Salle de concert'
];

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

  goToStep2() {
    this.step = 2;
  } 

  buildFullPrompt(): string {
    const { message, character, action, location } = this.form;
    let description = '';

    if (character && action && location) {
      description = ` Un(e) ${character} qui ${action.toLowerCase()} à ${location.toLowerCase()}.`;
    } else if (character && action) {
      description = ` Un(e) ${character} qui ${action.toLowerCase()}.`;
    } else if (character && location) {
      description = ` Un(e) ${character} à ${location.toLowerCase()}.`;
    } else if (action && location) {
      description = ` Quelqu'un qui ${action.toLowerCase()} à ${location.toLowerCase()}.`;
    } else if (character) {
      description = ` Un(e) ${character}.`;
    } else if (action) {
      description = ` Quelqu'un qui ${action.toLowerCase()}.`;
    } else if (location) {
      description = ` À ${location.toLowerCase()}.`;
    }

    return (message || '') + description;
  }

  onSubmit() {
    this.isLoading = true;
    this.successMessage = '';

    setTimeout(() => {
      this.isLoading = false;
      this.successMessage = 'Vidéo générée avec succès ! Retournez sur la liste des vidéos pour la retrouver.';
    }, 3000);

    this.videoService.generateVideo(
      this.buildFullPrompt(),
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