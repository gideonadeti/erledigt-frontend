import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { ValidationErrors, Validators } from '@angular/forms';

import { AuthFormComponent } from './auth-form.component';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-sign-up-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AuthFormComponent],
  template: `
    <app-auth-form
      [text]="'Sign Up'"
      [pendingText]="'Signing up...'"
      [passwordValidators]="passwordValidators"
      [passwordHelper]="passwordHelper"
      [passwordAutocomplete]="'new-password'"
      [submitFn]="submitFn"
      (success)="success.emit()"
    />
  `,
})
export class SignUpFormComponent {
  private readonly authService = inject(AuthService);
  readonly success = output<void>();
  protected readonly passwordValidators = [
    Validators.required,
    Validators.minLength(6),
    Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/),
  ];

  protected readonly passwordHelper = (errors: ValidationErrors | null): string[] => {
    if (!errors) return [];

    const messages: string[] = [];

    if (errors['required']) messages.push('Password is required.');
    if (errors['minlength']) messages.push('Passwords must be at least 6 characters.');
    if (errors['pattern']) {
      messages.push(
        'Include at least one lowercase, uppercase, digit, and non-alphanumeric character.'
      );
    }

    return messages;
  };

  protected readonly submitFn = (payload: { email: string; password: string }) =>
    this.authService.register(payload);
}
