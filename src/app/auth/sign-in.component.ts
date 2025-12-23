import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmInputImports } from '@spartan-ng/helm/input';

import { SubmitButtonComponent } from './submit-button.component';
import { SignInFormComponent } from './sign-in-form.component';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-sign-in',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    HlmCardImports,
    HlmFieldImports,
    HlmInputImports,
    SignInFormComponent,
  ],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div class="w-full max-w-md">
        <div hlmCard>
          <div hlmCardHeader class="text-center space-y-2">
            <h1 hlmCardTitle class="text-3xl font-bold tracking-tight">Sign in</h1>
            <p hlmCardDescription>Enter your credentials to access your account</p>
          </div>

          <div hlmCardContent>
            <app-sign-in-form (success)="onSuccess()" />
          </div>

          <div hlmCardFooter class="justify-center text-sm text-muted-foreground">
            Don't have an account?
            <a routerLink="/auth/sign-up" class="text-primary font-medium hover:underline ml-1">
              Sign up
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class SignInComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  protected onSuccess() {
    this.router.navigateByUrl('/');
  }
}
