import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class VideoService {
  private apiUrl = 'http://localhost:3000/api/v1/videos';
  private AgentUrl = 'http://localhost:3002/gorilla/invoke';

  constructor(private http: HttpClient) {}

  generateVideo(
    message: string,
    model: string = 'veo-2.0-generate-001',
    aspectRatio: string = '16:9',
    personGeneration: string = 'dont_allow',
    numberOfVideos: number = 1,
    durationSeconds: number = 8,
    userId: number | string
  ): Observable<any> {
    const body = {  
      message,
      model,
      aspectRatio,
      personGeneration,
      numberOfVideos,
      durationSeconds,
      userId
    };
    return this.http.post<any>(`${this.AgentUrl}`, body);
  }

  /**
   * Upload une vidéo sur le backend.
   * @param file Le fichier vidéo à uploader (File ou Blob)
   * @param userId L'id de l'utilisateur (string ou number)
   * @param promptId L'id du prompt (string ou number)
   */
  uploadVideo(file: File, userId: number | string, promptId: number | string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    let params = new HttpParams()
      .set('userId', userId.toString())
      .set('promptId', promptId.toString());

    return this.http.post(`${this.apiUrl}/upload`, formData, { params });
  }

  /**
   * Récupère toutes les vidéos
   */
  getAllVideos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }
}