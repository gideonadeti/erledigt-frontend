import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HlmCardImports } from '@spartan-ng/helm/card';

import { SignUpFormComponent } from './sign-up-form.component';

@Component({
  selector: 'app-sign-up',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, HlmCardImports, SignUpFormComponent],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div class="w-full max-w-md">
        <div hlmCard>
          <div hlmCardHeader class="text-center space-y-2">
            <h1 hlmCardTitle class="text-3xl font-bold tracking-tight">Sign up</h1>
            <p hlmCardDescription>Enter your information to get started</p>
          </div>

          <div hlmCardContent>
            <app-sign-up-form (success)="onSuccess()" />
          </div>

          <div hlmCardFooter class="justify-center text-sm text-muted-foreground">
            Already have an account?
            <a routerLink="/auth/sign-in" class="text-primary font-medium hover:underline ml-1">
              Sign in
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class SignUpComponent {
  private readonly router = inject(Router);

  protected onSuccess() {
    this.router.navigateByUrl('/auth/sign-in');
  }
}
