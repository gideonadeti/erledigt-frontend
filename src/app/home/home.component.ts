import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AuthService, ManageInfoResponse } from '../auth/auth.service';
import { LandingPageComponent } from '../landing/landing-page.component';
import { DashboardComponent } from '../dashboard/dashboard.component';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LandingPageComponent, DashboardComponent],
  template: `
    @if (isLoading()) {
    <div class="flex items-center justify-center min-h-[60vh]">
      <div class="text-center space-y-2">
        <div class="text-lg font-medium">Loading...</div>
      </div>
    </div>
    } @else { @if (user(); as currentUser) {
    <app-dashboard [user]="currentUser" />
    } @else {
    <app-landing-page />
    } }
  `,
})
export class HomeComponent {
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly isLoading = signal(true);
  protected readonly user = signal<ManageInfoResponse | null>(null);

  constructor() {
    this.loadCurrentUser();
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
