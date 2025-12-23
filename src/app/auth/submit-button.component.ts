import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';

@Component({
  selector: 'app-submit-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmButtonImports, HlmSpinnerImports],
  template: `
    <button hlmBtn hlmBtnPrimary class="w-full" type="submit" [disabled]="disabled() || pending()">
      @if (pending()) {
      <hlm-spinner />
      {{ pendingText() }}
      } @else {
      {{ text() }}
      }
    </button>
  `,
})
export class SubmitButtonComponent {
  readonly text = input('Submit');
  readonly pendingText = input('Submitting...');
  readonly disabled = input(false);
  readonly pending = input(false);
}
