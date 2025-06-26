import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-web-scraper',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  template: `
    <div style="max-width: 600px; margin: 2rem auto; padding: 2rem; background: #fff; border-radius: 1rem; box-shadow: 0 2px 10px rgba(0,0,0,0.07);">
      <h1>Aspirateur de site web</h1>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <label>URL du site à aspirer*
          <input formControlName="url" type="text" class="input-url" required placeholder="https://..." />
        </label>
        <button type="submit" class="main-btn" style="margin-top: 1.5rem; width: 100%;" [disabled]="loading">Lancer l'aspiration</button>
      </form>
      <div *ngIf="loading" style="margin-top: 2rem; text-align: center;">
        <span class="loader"></span>
        <div style="margin-top: 1rem;">Téléchargement du site en cours...</div>
      </div>
      <div *ngIf="downloadId && !loading" style="margin-top: 2rem; text-align: center;">
        <a [href]="downloadUrl" class="main-btn" download>Télécharger le site aspiré (.zip)</a>
      </div>
      <div *ngIf="error" style="margin-top: 2rem; color: #c00;">{{ error }}</div>
      <style>
        .input-url {
          width: 100%;
          min-width: 0;
          font-size: 1.1rem;
          padding: 0.75rem 1rem;
          border: 1px solid #ccc;
          border-radius: 0.5rem;
          margin-top: 0.5rem;
          box-sizing: border-box;
        }
        .loader {
          display: inline-block;
          width: 32px;
          height: 32px;
          border: 4px solid #eee;
          border-top: 4px solid #007bff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    </div>
  `
})
export class WebScraperComponent {
  form: FormGroup;
  loading = false;
  downloadId: string | null = null;
  error: string | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.form = this.fb.group({
      url: ['']
    });
  }

  get downloadUrl() {
    return `/api/v1/web-scraper/download/${this.downloadId}`;
  }

  onSubmit() {
    this.error = null;
    this.downloadId = null;
    if (!this.form.value.url) return;
    this.loading = true;
    this.http.post<{id: string}>(`/api/v1/web-scraper`, { url: this.form.value.url }).subscribe({
      next: (res) => {
        this.downloadId = res.id;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || "Erreur lors de l'aspiration.";
        this.loading = false;
      }
    });
  }
} 