import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { Validators } from '@angular/forms';

import { AuthFormComponent } from './auth-form.component';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-sign-in-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AuthFormComponent],
  template: `
    <app-auth-form
      [text]="'Sign In'"
      [pendingText]="'Signing in...'"
      [passwordValidators]="passwordValidators"
      [passwordHelper]="passwordHelper"
      [passwordAutocomplete]="'current-password'"
      [submitFn]="submitFn"
      (success)="success.emit()"
    />
  `,
})
export class SignInFormComponent {
  private readonly authService = inject(AuthService);

  readonly success = output<void>();

  protected readonly passwordValidators = [Validators.required];
  protected readonly passwordHelper = () => [];
  protected readonly submitFn = (payload: { email: string; password: string }) =>
    this.authService.login(payload);
}
