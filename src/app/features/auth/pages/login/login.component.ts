import { Component, inject, signal, ViewContainerRef } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { Dialog } from '@angular/cdk/dialog';
import { AuthService } from '../../../../core/auth/auth.service';
import { LoginCredentials } from '../../../../core/auth/auth.repository';
import { ClientDTO } from '../../../../core/auth/session.model';
import { THEME_CONFIG } from '../../../../core/config/theme.config';
import { ToastService } from '../../../../core/services/toast.service';
import { ClientPickerDialogComponent } from './client-picker-dialog/client-picker-dialog.component';

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
  private readonly dialog = inject(Dialog);
  private readonly toast = inject(ToastService);
  private readonly viewContainerRef = inject(ViewContainerRef);
  readonly config = inject(THEME_CONFIG);

  readonly form = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  loading = signal(false);
  showPassword = signal(false);

  get usernameControl() { return this.form.get('username')!; }
  get passwordControl() { return this.form.get('password')!; }

  submit(): void {
    if (this.form.invalid) return;

    this.loading.set(true);

    const { username, password } = this.form.value;
    const credentials: LoginCredentials = { username: username!, password: password! };

    this.auth.getClients(credentials).subscribe({
      next: (clients) => this.handleClients(credentials, clients),
      error: () => this.loading.set(false),
    });
  }

  private handleClients(credentials: LoginCredentials, clients: ClientDTO[]): void {
    if (clients.length === 0) {
      this.loading.set(false);
      this.toast.show({ message: 'Nenhum cliente disponível para este usuário.', type: 'error' });
      return;
    }

    if (clients.length === 1) {
      this.loginToClient(credentials, clients[0].code);
      return;
    }

    this.loading.set(false);
    this.openClientPicker(credentials, clients);
  }

  private openClientPicker(credentials: LoginCredentials, clients: ClientDTO[]): void {
    const ref = this.dialog.open<string | undefined>(ClientPickerDialogComponent, {
      viewContainerRef: this.viewContainerRef,
      data: { clients },
    });

    ref.closed.subscribe((clientCode) => {
      if (clientCode) {
        this.loginToClient(credentials, clientCode);
      }
    });
  }

  private loginToClient(credentials: LoginCredentials, clientCode: string): void {
    this.loading.set(true);
    this.auth.login(credentials, clientCode).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/']);
      },
      error: () => this.loading.set(false),
    });
  }
}
