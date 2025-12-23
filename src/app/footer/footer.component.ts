import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideChevronUp,
  lucideGithub,
  lucideLinkedin,
  lucideMail,
  lucideTwitter,
} from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';

@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIcon, HlmIcon],
  providers: [
    provideIcons({
      lucideChevronUp,
      lucideGithub,
      lucideLinkedin,
      lucideMail,
      lucideTwitter,
    }),
  ],
  template: `
    <footer class="border-t bg-muted/30 text-center">
      <div class="container mx-auto px-6 sm:px-8 lg:px-12 py-8 sm:py-10">
        <div class="flex flex-col items-center gap-4">
          <p class="mb-2 text-sm font-medium text-muted-foreground">
            Engineered by
            <span class="font-semibold text-foreground">Gideon Adeti</span>
          </p>

          <div class="flex items-center justify-center gap-3">
            <a
              href="https://github.com/gideonadeti"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center justify-center text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 hover:scale-110 hover:text-primary active:translate-y-0 active:scale-105"
              title="GitHub"
              aria-label="GitHub"
            >
              <ng-icon hlm name="lucideGithub" class="size-5" />
            </a>
            <a
              href="https://linkedin.com/in/gideonadeti"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center justify-center text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 hover:scale-110 hover:text-primary active:translate-y-0 active:scale-105"
              title="LinkedIn"
              aria-label="LinkedIn"
            >
              <ng-icon hlm name="lucideLinkedin" class="size-5" />
            </a>
            <a
              href="https://x.com/gideonadeti0"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center justify-center text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 hover:scale-110 hover:text-primary active:translate-y-0 active:scale-105"
              title="X (Twitter)"
              aria-label="X (Twitter)"
            >
              <ng-icon hlm name="lucideTwitter" class="size-5" />
            </a>
            <a
              href="mailto:gideonadeti0@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center justify-center text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 hover:scale-110 hover:text-primary active:translate-y-0 active:scale-105"
              title="Email"
              aria-label="Email"
            >
              <ng-icon hlm name="lucideMail" class="size-5" />
            </a>
          </div>

          <button
            type="button"
            class="mt-2 inline-flex size-10 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground transition-all duration-200 hover:scale-110 hover:bg-muted/80 hover:text-foreground active:scale-100"
            title="Back to top"
            aria-label="Back to top"
            (click)="scrollToTop()"
          >
            <ng-icon hlm name="lucideChevronUp" class="size-5" />
          </button>

          <p class="mb-0 mt-2 text-xs text-muted-foreground">
            &copy; {{ currentYear }} Erledigt. All Rights Reserved.
          </p>

          <div class="mt-3">
            <a
              href="https://buymeacoffee.com/gideonadeti"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:scale-105 hover:bg-primary/90 active:scale-100"
              title="Support me with a coffee"
              aria-label="Buy me a coffee"
            >
              <span>☕</span>
              <span>Buy me a coffee</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  protected readonly currentYear = new Date().getFullYear();

  protected scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
