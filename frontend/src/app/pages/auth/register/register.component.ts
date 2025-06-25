import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class RegisterComponent {
  userForm: FormGroup;
  loading = false;
  error: string | null = null;

  sectors = [
    { id: 'it', name: 'Informatique' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'finance', name: 'Finance' },
    { id: 'health', name: 'Santé' },
    { id: 'education', name: 'Éducation' },
  ];

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      role: ['provider', Validators.required],
      sector: ['', Validators.required],
    });
  }

  submit() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.error = null;

    const registerPayload = {
      ...this.userForm.value,
    };

    this.auth.register(registerPayload).subscribe({
      next: () => this.router.navigate(['']),
      error: err => {
        this.error = err?.error?.message || 'Erreur lors de l’inscription';
        this.loading = false;
      }
    });
  }
}