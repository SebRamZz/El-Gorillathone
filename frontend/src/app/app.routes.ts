import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'register',
        loadComponent: () => import('./pages/auth/register/register.component').then(m => m.RegisterComponent)
    },
    {
        path: 'videos',
        loadComponent: () => import('./pages/videos/list-videos/list-videos.component').then(m => m.ListVideosComponent)
    },
    {
        path: 'videos/create',
        loadComponent: () => import('./pages/videos/create-videos/create-videos.component').then(m => m.CreateVideosComponent)
    },
    {
        path: 'services',
        loadComponent: () => import('./pages/services/services.component').then(m => m.ServicesComponent)
    },
    {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent)
    },
    {
        path: 'web-scraper',
        loadComponent: () => import('./pages/web-scraper/web-scraper.component').then(m => m.WebScraperComponent)
    }
];
