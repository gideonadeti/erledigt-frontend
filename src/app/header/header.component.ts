import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize, filter } from 'rxjs';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLogOut } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { toast } from 'ngx-sonner';

import { AuthService, ManageInfoResponse } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NgIcon, HlmIcon, HlmButtonImports],
  providers: [provideIcons({ lucideLogOut })],
  template: `
    <header
      class="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60"
    >
      <div
        class="container mx-auto flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8"
      >
        <a routerLink="/" class="flex items-center gap-2">
          <div
            class="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground"
          >
            <span class="text-sm font-bold">E</span>
          </div>
          <span class="hidden text-lg font-semibold sm:inline">Erledigt</span>
        </a>

        <div class="flex items-center gap-3">
          @if (isLoading()) {
          <div class="flex items-center">
            <span class="hidden text-sm text-muted-foreground sm:inline-block">Loading...</span>
          </div>
          } @else { @if (user(); as currentUser) {
          <div class="flex items-center gap-2">
            <div class="hidden text-sm font-medium text-foreground sm:block">
              {{ currentUser.email }}
            </div>
            <button
              hlmBtn
              variant="ghost"
              size="sm"
              (click)="onLogout()"
              [disabled]="isLoggingOut()"
            >
              <ng-icon hlm size="sm" name="lucideLogOut" />
              <span class="hidden sm:inline">Sign out</span>
            </button>
          </div>
          } @else {
          <a
            routerLink="/auth/sign-in"
            class="text-sm font-medium text-primary transition-colors hover:underline"
          >
            Sign in
          </a>
          } }
        </div>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly isLoading = signal(true);
  protected readonly isLoggingOut = signal(false);
  protected readonly user = signal<ManageInfoResponse | null>(null);

  constructor() {
    this.loadCurrentUser();

    this.router.events
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        filter((event) => event instanceof NavigationEnd)
      )
      .subscribe(() => {
        this.loadCurrentUser();
      });
  }

  protected onLogout(): void {
    if (this.isLoggingOut()) {
      return;
    }

    this.isLoggingOut.set(true);
    this.authService
      .logout()
      .pipe(
        finalize(() => this.isLoggingOut.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.user.set(null);
        toast.success('Signed out successfully', {
          description: 'You have been logged out',
        });
        this.router.navigateByUrl('/auth/sign-in');
      });
  }

  private loadCurrentUser(): void {
    this.isLoading.set(true);

    this.authService
      .fetchCurrentUser()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((currentUser) => {
        this.user.set(currentUser ?? null);
        this.isLoading.set(false);
      });
  }
}
