import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { VideoService } from '../../../services/video.service';

@Component({
  selector: 'app-list-videos',
  templateUrl: './list-videos.component.html',
  styleUrls: ['./list-videos.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink]
})
export class ListVideosComponent implements OnInit {
  public videos: any[] = [];
  public videoDurations: { [id: number]: number } = {};

  constructor(private videoService: VideoService, private router: Router) {}

  ngOnInit() {
    this.videoService.getAllVideos().subscribe({
      next: (videos) => this.videos = videos,
      error: (err) => console.error('Erreur chargement vidéos', err)
    });
  }

  onLoadedMetadata(event: Event, videoId: number) {
    const videoElement = event.target as HTMLVideoElement;
    this.videoDurations[videoId] = videoElement.duration;
  }

  loadVideos() {
    this.videoService.getAllVideos().subscribe({
      next: (res) => {
        this.videos = res;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des vidéos :', err);
      }
    });
  }
}