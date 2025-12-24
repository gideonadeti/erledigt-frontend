import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { injectMutation, QueryClient } from '@tanstack/angular-query-experimental';
import { BrnDialogImports } from '@spartan-ng/brain/dialog';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';

import { TasksService } from './tasks.service';
import type { Task } from './task.model';
import { DialogFooterComponent } from './dialog-footer.component';

@Component({
  selector: 'app-delete-task-confirmation-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmDialogImports, BrnDialogImports, DialogFooterComponent],
  template: `
    <hlm-dialog [state]="dialogState()" (closed)="onClosed()">
      <hlm-dialog-content *brnDialogContent="let ctx" class="w-full max-w-[400px] sm:w-[400px]">
        <hlm-dialog-header>
          <h3 hlmDialogTitle>Delete Task</h3>
          <p hlmDialogDescription>
            Are you sure you want to delete <strong>"{{ task()?.title }}"</strong>? This action
            cannot be undone.
          </p>
        </hlm-dialog-header>

        <app-dialog-footer
          [isPending]="deleteTaskMutation.isPending()"
          [text]="'Delete'"
          [pendingText]="'Deleting...'"
          [submitVariant]="'destructive'"
          [handleCancel]="closeDialog"
          [handleSubmit]="onConfirm"
        />
      </hlm-dialog-content>
    </hlm-dialog>
  `,
})
export class DeleteTaskConfirmationDialogComponent {
  private readonly tasksService = inject(TasksService);
  private readonly queryClient = inject(QueryClient);

  readonly open = input(false);
  readonly task = input<Task | null>(null);
  readonly openChange = output<boolean>();
  readonly success = output<void>();

  readonly dialogState = computed<'open' | 'closed'>(() => (this.open() ? 'open' : 'closed'));

  readonly deleteTaskMutation = injectMutation(() => ({
    mutationFn: (id: number) => this.tasksService.deleteTask(id),
    onSuccess: () => {
      this.queryClient.invalidateQueries({ queryKey: ['tasks'] });
      this.closeDialog();
      this.success.emit();
    },
  }));

  onClosed() {
    this.openChange.emit(false);
  }

  closeDialog = () => {
    this.openChange.emit(false);
  };

  onConfirm = () => {
    const task = this.task();

    if (task) {
      this.deleteTaskMutation.mutate(task.id);
    }
  };
}
