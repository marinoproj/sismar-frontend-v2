import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { AuthService } from '../../../../core/auth/auth.service';
import { THEME_CONFIG } from '../../../../core/config/theme.config';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './login.component.html',
  styles: [`
    :host {
      color-scheme: light;
      --color-text:     #111827;
      --color-bg:       #f9fafb;
      --color-gray-50:  #f9fafb;
      --color-gray-100: #f3f4f6;
      --color-gray-200: #e5e7eb;
      --color-gray-300: #d1d5db;
      --color-gray-400: #9ca3af;
      --color-gray-500: #6b7280;
      --color-gray-600: #4b5563;
      --color-gray-700: #374151;
      --color-gray-800: #1f2937;
      --color-gray-900: #111827;
      --color-gray-950: #030712;
    }
  `],
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  readonly config = inject(THEME_CONFIG);

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  loading = signal(false);
  error = signal('');
  showPassword = signal(false);

  get emailControl() { return this.form.get('email')!; }
  get passwordControl() { return this.form.get('password')!; }

  submit(): void {
    if (this.form.invalid) return;

    this.loading.set(true);
    this.error.set('');

    const { email, password } = this.form.value;

    this.auth.login({ email: email!, password: password! }).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('E-mail ou senha inválidos. Tente novamente.');
      },
    });
  }
}
