import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogRef } from '@angular/cdk/dialog';
import { ModalShellComponent } from '../../../../../shared/ui/modal/modal-shell/modal-shell.component';
import { ButtonComponent } from '../../../../../shared/ui/button/button.component';

export interface CustomerFormValue {
  nome: string;
  email: string;
  telefone: string | null;
  categoria: string;
  ativo: boolean;
}

@Component({
  selector: 'app-customer-form-dialog',
  standalone: true,
  imports: [ModalShellComponent, ButtonComponent, ReactiveFormsModule],
  templateUrl: './customer-form-dialog.component.html',
})
export class CustomerFormDialogComponent {
  private readonly fb = inject(FormBuilder);
  readonly dialogRef = inject(DialogRef<CustomerFormValue | undefined, CustomerFormDialogComponent>);

  readonly form = this.fb.group({
    nome: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telefone: [''],
    categoria: ['Varejo', Validators.required],
    ativo: [true],
  });

  get nomeControl() {
    return this.form.get('nome')!;
  }

  get emailControl() {
    return this.form.get('email')!;
  }

  save(): void {
    if (this.form.invalid) return;
    this.dialogRef.close(this.form.value as CustomerFormValue);
  }

  cancel(): void {
    this.dialogRef.close(undefined);
  }
}
