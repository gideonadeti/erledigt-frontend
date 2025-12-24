import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheckSquare, lucidePlus } from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';

import { TasksService } from './tasks.service';
import type { Task } from './task.model';
import { TaskCardComponent } from './task-card.component';
import { CreateTaskDialogComponent } from './create-task-dialog.component';
import { DeleteTaskConfirmationDialogComponent } from './delete-task-confirmation-dialog.component';

@Component({
  selector: 'app-tasks',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    HlmCardImports,
    TaskCardComponent,
    HlmEmptyImports,
    HlmButtonImports,
    HlmSkeletonImports,
    CreateTaskDialogComponent,
    DeleteTaskConfirmationDialogComponent,
    NgIcon,
    HlmIcon,
  ],
  providers: [provideIcons({ lucideCheckSquare, lucidePlus })],
  template: `
    <section class="space-y-6">
      @if (tasks.isPending()) {
      <div class="flex items-start justify-between gap-4">
        <div>
          <hlm-skeleton class="h-9 w-32 mb-2" />
          <hlm-skeleton class="h-5 w-48" />
        </div>
        <hlm-skeleton class="h-10 w-28" />
      </div>
      } @else { @if (tasks.isError() || (tasks.data() ?? []).length > 0) {
      <div class="flex items-start justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold">Tasks</h1>
          <p class="text-muted-foreground">
            {{ taskCount() }} task{{ taskCount() !== 1 ? 's' : '' }} available
          </p>
        </div>
        <button hlmBtn (click)="openDialog()">
          <ng-icon hlm size="sm" name="lucidePlus" />
          Add Task
        </button>
      </div>
      } } @if (tasks.isPending()) {
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        @for (item of [1, 2, 3, 4, 5, 6]; track item) {
        <section hlmCard class="flex flex-col justify-between">
          <div hlmCardHeader class="flex items-start justify-between gap-2">
            <div class="flex-1 space-y-2">
              <hlm-skeleton class="h-5 w-3/4" />
              <hlm-skeleton class="h-4 w-1/2" />
            </div>
            <hlm-skeleton class="h-6 w-16 rounded-full" />
          </div>
          <div hlmCardContent class="space-y-2">
            <hlm-skeleton class="h-4 w-full" />
            <hlm-skeleton class="h-4 w-5/6" />
          </div>
          <div hlmCardFooter class="mt-2 flex items-center justify-between gap-2">
            <hlm-skeleton class="h-4 w-24" />
            <hlm-skeleton class="h-5 w-20 rounded-full" />
          </div>
        </section>
        }
      </div>
      } @else { @if (tasks.isError()) {
      <div class="space-y-3">
        <p class="text-sm text-destructive">Something went wrong while loading your tasks.</p>
        <button
          type="button"
          class="inline-flex items-center rounded-md bg-destructive px-3 py-1.5 text-sm font-medium text-destructive-foreground hover:bg-destructive/90"
          (click)="refetch()"
        >
          Try again
        </button>
      </div>
      } @else { @if ((tasks.data() ?? []).length > 0) {
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        @for (task of tasks.data() ?? []; track task.id) {
        <app-task-card
          [task]="task"
          (editTask)="onEditTask($event)"
          (deleteTask)="onDeleteTask($event)"
        />
        }
      </div>
      } @else {
      <div hlmEmpty>
        <div hlmEmptyHeader>
          <div hlmEmptyMedia variant="icon">
            <ng-icon name="lucideCheckSquare" />
          </div>
          <div hlmEmptyTitle>No Tasks Yet</div>
          <div hlmEmptyDescription>
            You haven&apos;t added any tasks yet. Get started by adding your first task.
          </div>
        </div>
        <div hlmEmptyContent>
          <button hlmBtn (click)="openDialog()">Add Task</button>
        </div>
      </div>
      } } }
    </section>

    <app-create-task-dialog
      [open]="dialogOpen()"
      [task]="editingTask()"
      (openChange)="onDialogOpenChange($event)"
    />

    <app-delete-task-confirmation-dialog
      [open]="deleteDialogOpen()"
      [task]="deletingTask()"
      (openChange)="onDeleteDialogOpenChange($event)"
    />
  `,
})
export class TasksComponent {
  private readonly tasksService = inject(TasksService);

  readonly dialogOpen = signal(false);
  readonly editingTask = signal<Task | null>(null);
  readonly deleteDialogOpen = signal(false);
  readonly deletingTask = signal<Task | null>(null);

  readonly tasks = injectQuery<Task[]>(() => ({
    queryKey: ['tasks'],
    queryFn: () => this.tasksService.getTasks(),
  }));

  readonly taskCount = computed(() => (this.tasks.data() ?? []).length);

  openDialog() {
    this.editingTask.set(null);
    this.dialogOpen.set(true);
  }

  onEditTask(task: Task) {
    this.editingTask.set(task);
    this.dialogOpen.set(true);
  }

  onDialogOpenChange(open: boolean) {
    this.dialogOpen.set(open);

    if (!open) {
      this.editingTask.set(null);
    }
  }

  onDeleteTask(task: Task) {
    this.deletingTask.set(task);
    this.deleteDialogOpen.set(true);
  }

  onDeleteDialogOpenChange(open: boolean) {
    this.deleteDialogOpen.set(open);

    if (!open) {
      this.deletingTask.set(null);
    }
  }

  refetch() {
    this.tasks.refetch();
  }
}
