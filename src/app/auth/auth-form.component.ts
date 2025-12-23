import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';

import { SubmitButtonComponent } from './submit-button.component';

type SubmitFn = (payload: { email: string; password: string }) => any;

@Component({
  selector: 'app-auth-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, HlmFieldImports, HlmInputImports, SubmitButtonComponent],
  template: `
    <form class="space-y-6" [formGroup]="form" (ngSubmit)="onSubmit()">
      <fieldset hlmFieldSet>
        <div hlmFieldGroup>
          <div hlmField [attr.data-invalid]="emailInvalid() ? true : null">
            <label hlmFieldLabel>Email</label>
            <input hlmInput type="email" formControlName="email" autocomplete="email" required />
            @if (emailInvalid()) {
            <hlm-field-error>Enter a valid email.</hlm-field-error>
            }
          </div>

          <div hlmField [attr.data-invalid]="passwordInvalid() ? true : null">
            <label hlmFieldLabel>Password</label>
            <input
              hlmInput
              type="password"
              formControlName="password"
              [attr.autocomplete]="passwordAutocomplete()"
              required
            />
            @if (passwordInvalid()) {
            <hlm-field-error>
              <ul class="list-disc list-inside space-y-1">
                @for (msg of passwordHelperMessages(); track msg) {
                <li>{{ msg }}</li>
                }
              </ul>
            </hlm-field-error>
            }
          </div>
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
