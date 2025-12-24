import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheckSquare, lucideCalendar, lucideFlag, lucideTarget } from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';

@Component({
  selector: 'app-landing-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, HlmCardImports, HlmButtonImports, NgIcon, HlmIcon],
  providers: [provideIcons({ lucideCheckSquare, lucideCalendar, lucideFlag, lucideTarget })],
  template: `
    <div class="flex flex-col">
      <!-- Hero Section -->
      <section class="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
        <div class="flex flex-col items-center text-center space-y-6">
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            Welcome to <span class="text-primary">Erledigt</span>
          </h1>
          <p class="max-w-2xl text-lg sm:text-xl text-muted-foreground">
            Your personal task management solution. Stay organized, stay productive, and get things
            done with ease.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 pt-4">
            <a routerLink="/auth/sign-up" hlmBtn size="lg"> Get Started </a>
            <a routerLink="/auth/sign-in" hlmBtn variant="outline" size="lg"> Sign In </a>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 bg-muted/30 rounded-lg">
        <div class="flex flex-col items-center space-y-8">
          <h2 class="text-3xl sm:text-4xl font-bold text-center">Why Choose Erledigt?</h2>
          <p class="text-lg text-muted-foreground text-center max-w-2xl">
            Experience seamless task management with our intuitive platform
          </p>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl mt-8">
            <section hlmCard>
              <div hlmCardHeader>
                <ng-icon hlm class="size-8 text-primary mb-2" name="lucideCheckSquare" />
                <h3 hlmCardTitle>Task Management</h3>
                <p hlmCardDescription>
                  Organize and track all your tasks in one convenient place. Stay on top of your
                  to-do list effortlessly.
                </p>
              </div>
            </section>

            <section hlmCard>
              <div hlmCardHeader>
                <ng-icon hlm class="size-8 text-primary mb-2" name="lucideFlag" />
                <h3 hlmCardTitle>Priority Levels</h3>
                <p hlmCardDescription>
                  Set priorities for your tasks to focus on what matters most. High, medium, or low
                  - you decide.
                </p>
              </div>
            </section>

            <section hlmCard>
              <div hlmCardHeader>
                <ng-icon hlm class="size-8 text-primary mb-2" name="lucideCalendar" />
                <h3 hlmCardTitle>Due Dates</h3>
                <p hlmCardDescription>
                  Never miss a deadline. Set due dates for your tasks and stay on schedule with
                  timely reminders.
                </p>
              </div>
            </section>

            <section hlmCard>
              <div hlmCardHeader>
                <ng-icon hlm class="size-8 text-primary mb-2" name="lucideTarget" />
                <h3 hlmCardTitle>Stay Focused</h3>
                <p hlmCardDescription>
                  Mark tasks as complete and track your progress. See your productivity improve with
                  every completed task.
                </p>
              </div>
            </section>
          </div>
        </div>
      </section>

      <!-- Final CTA Section -->
      <section class="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div class="flex flex-col items-center text-center space-y-6">
          <h2 class="text-3xl sm:text-4xl font-bold">Ready to Get Started?</h2>
          <p class="text-lg text-muted-foreground max-w-2xl">
            Join countless users who trust Erledigt for their task management. Start organizing your
            life today!
          </p>
          <a routerLink="/auth/sign-up" hlmBtn size="lg" class="mt-4"> Create Your Account </a>
        </div>
      </section>
    </div>
  `,
})
export class LandingPageComponent {}
