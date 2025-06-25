import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  error: string | null = null;
  popup: { message: string; color: string } | null = null;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  submit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.error = null;
    this.popup = null;
    this.auth.login(this.loginForm.value).subscribe({
      next: () => {
        this.popup = { message: 'Connexion réussie', color: 'green' };
        this.loading = false;
        setTimeout(() => {
          this.popup = null;
          this.router.navigate(['/']);
        }, 1500);
      },
      error: err => {
        this.popup = { message: 'Échec de la connexion', color: 'red' };
        this.error = err?.error?.message || 'Erreur de connexion';
        this.loading = false;
        setTimeout(() => this.popup = null, 2000);
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}