import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmFormFieldImports } from '@spartan-ng/helm/form-field';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideEye, lucideEyeOff } from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';

import { SubmitButtonComponent } from './submit-button.component';

type SubmitFn = (payload: { email: string; password: string }) => any;

@Component({
  selector: 'app-auth-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    HlmFieldImports,
    HlmFormFieldImports,
    HlmInputImports,
    HlmLabelImports,
    SubmitButtonComponent,
    NgIcon,
    HlmIcon,
  ],
  providers: [provideIcons({ lucideEye, lucideEyeOff })],
  template: `
    <form class="space-y-6" [formGroup]="form" (ngSubmit)="onSubmit()">
      <fieldset hlmFieldSet>
        <div hlmFieldGroup>
          <hlm-form-field>
            <label hlmLabel>Email</label>
            <input hlmInput type="email" formControlName="email" autocomplete="email" required />
            <hlm-error>Enter a valid email.</hlm-error>
          </hlm-form-field>

          <hlm-form-field>
            <label hlmLabel>Password</label>
            <div class="relative">
              <input
                hlmInput
                [type]="showPassword() ? 'text' : 'password'"
                formControlName="password"
                [attr.autocomplete]="passwordAutocomplete()"
                required
              />
              <button
                type="button"
                (click)="togglePasswordVisibility()"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                @if (showPassword()) {
                <ng-icon hlm name="lucideEyeOff" size="sm" />
                } @else {
                <ng-icon hlm name="lucideEye" size="sm" />
                }
              </button>
            </div>
            <hlm-error>
              <ul class="list-disc list-inside space-y-1">
                @for (msg of passwordHelperMessages(); track msg) {
                <li>{{ msg }}</li>
                }
              </ul>
            </hlm-error>
          </hlm-form-field>
        </div>
      </fieldset>

      @if (error()) {
      <div class="text-sm text-destructive">{{ error() }}</div>
      } @if (fieldErrors().length) {
      <div class="text-sm text-destructive space-y-1">
        @for (msg of fieldErrors(); track msg) {
        <div>{{ msg }}</div>
        }
      </div>
      }

      <app-submit-button
        [text]="text()"
        [pendingText]="pendingText()"
        [pending]="submitting()"
        [disabled]="!form.dirty"
      />
    </form>
  `,
})
export class AuthFormComponent {
  private readonly fb = inject(FormBuilder);

  readonly text = input<string>('Submit');
  readonly pendingText = input<string>('Submitting...');
  readonly submitFn = input<SubmitFn | null>(null);
  readonly passwordValidators = input<ValidatorFn[]>([Validators.required]);
  readonly passwordHelper = input<(errors: ValidationErrors | null) => string[]>((errors) =>
    errors ? [] : []
  );
  readonly passwordAutocomplete = input<string>('current-password');

  readonly success = output<void>();

  protected readonly submitting = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly fieldErrors = signal<string[]>([]);
  protected readonly showPassword = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', this.buildPasswordValidators()],
  });

  protected emailInvalid() {
    const control = this.form.controls.email;
    return control.invalid && (control.dirty || control.touched);
  }

  protected passwordInvalid() {
    const control = this.form.controls.password;
    return control.invalid && (control.dirty || control.touched);
  }

  protected passwordHelperMessages(): string[] {
    const control = this.form.controls.password;
    const errors = control.errors as ValidationErrors | null;
    return this.passwordHelper()(errors);
  }

  protected togglePasswordVisibility(): void {
    this.showPassword.update((value) => !value);
  }

  protected onSubmit() {
    if (this.form.invalid || this.submitting()) {
      return;
    }

    const submit = this.submitFn();
    if (!submit) return;

    this.submitting.set(true);
    this.error.set(null);
    this.fieldErrors.set([]);

    submit(this.form.getRawValue()).subscribe({
      next: () => {
        this.submitting.set(false);
        this.success.emit();
      },
      error: (err: any) => {
        this.submitting.set(false);
        const apiErrors = this.parseApiErrors(err?.error);
        if (apiErrors.length) {
          this.fieldErrors.set(apiErrors);
        } else {
          this.error.set(err?.error?.title ?? 'Request failed. Please try again.');
        }
      },
    });
  }

  private buildPasswordValidators() {
    const validators = this.passwordValidators();
    // Always ensure required; other validators supplied by caller.
    return validators.length ? validators : [Validators.required];
  }

  private parseApiErrors(errorBody: any): string[] {
    if (!errorBody || typeof errorBody !== 'object') return [];
    const errors = errorBody.errors as Record<string, string[]> | undefined;
    if (!errors) return [];
    return Object.values(errors).flat();
  }
}
