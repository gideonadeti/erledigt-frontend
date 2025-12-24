import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmSpinnerImports } from '@spartan-ng/helm/spinner';

@Component({
  selector: 'app-dialog-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmButtonImports, HlmDialogImports, HlmSpinnerImports],
  template: `
    <hlm-dialog-footer>
      <button hlmBtn variant="outline" (click)="handleCancel()()" [disabled]="isPending()">
        Cancel
      </button>
      <button hlmBtn (click)="handleSubmit()()" [disabled]="disabled() || isPending()">
        @if (isPending()) {
        <hlm-spinner />
        {{ pendingText() }}
        } @else {
        {{ text() }}
        }
      </button>
    </hlm-dialog-footer>
  `,
})
export class DialogFooterComponent {
  readonly isPending = input(false);
  readonly disabled = input(false);
  readonly text = input('');
  readonly pendingText = input('');
  readonly handleCancel = input(() => {});
  readonly handleSubmit = input(() => {});
}
