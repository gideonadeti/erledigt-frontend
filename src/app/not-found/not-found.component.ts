import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideHome, lucideArrowLeft } from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';

@Component({
  selector: 'app-not-found',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, HlmCardImports, HlmButtonImports, NgIcon, HlmIcon],
  providers: [provideIcons({ lucideHome, lucideArrowLeft })],
  template: `
    <div class="flex items-center justify-center min-h-[60vh]">
      <section hlmCard class="w-full max-w-md">
        <div hlmCardHeader class="text-center">
          <h1 class="text-6xl font-bold text-primary mb-2">404</h1>
          <h2 hlmCardTitle>Page Not Found</h2>
          <p hlmCardDescription class="text-base">
            The page you are looking for does not exist or has been moved.
          </p>
        </div>
        <div hlmCardContent class="space-y-4">
          <div class="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <a routerLink="/" hlmBtn>
              <ng-icon hlm name="lucideHome" class="mr-2" />
              Go Home
            </a>
            <button hlmBtn variant="outline" (click)="goBack()">
              <ng-icon hlm name="lucideArrowLeft" class="mr-2" />
              Go Back
            </button>
          </div>
        </div>
      </section>
    </div>
  `,
})
export class NotFoundComponent {
  goBack(): void {
    window.history.back();
  }
}
