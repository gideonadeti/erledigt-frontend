import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { HlmCardImports } from '@spartan-ng/helm/card';

import { TasksService } from './tasks.service';
import type { Task } from './task.model';

@Component({
  selector: 'app-tasks',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmCardImports, DatePipe],
  template: `
    <section class="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <header class="mb-6 flex items-center justify-between gap-2">
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Tasks</h1>
          <p class="mt-1 text-sm text-muted-foreground">
            View and manage your tasks for today and beyond.
          </p>
        </div>

        <button
          type="button"
          class="inline-flex items-center gap-1 rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-muted"
          (click)="refetch()"
          [disabled]="tasks.isFetching()"
        >
          <span> @if (!tasks.isFetching()) { Refresh } @else { Refreshing... } </span>
        </button>
      </header>

      @if (tasks.isPending()) {
      <div class="space-y-4">
        <p class="text-sm text-muted-foreground">Loading your tasks...</p>
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
        <section hlmCard class="flex flex-col justify-between">
          <div hlmCardHeader class="flex items-start justify-between gap-2">
            <div>
              <h2 hlmCardTitle class="text-base font-semibold text-foreground line-clamp-2">
                {{ task.title }}
              </h2>
            </div>

            <span
              class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
              [class]="priorityBadgeClass(task)"
            >
              {{ task.priority }}
            </span>
          </div>

          <p hlmCardContent class="text-sm text-muted-foreground line-clamp-3">
            {{ task.description || 'No description provided.' }}
          </p>

          <div hlmCardFooter class="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div class="flex items-center gap-1 text-muted-foreground">
              <span class="font-medium">Due:</span>
              <span>
                {{ task.dueDate ? (task.dueDate | date : 'mediumDate') : 'No due date' }}
              </span>
            </div>

            <span
              class="inline-flex items-center rounded-full px-2 py-0.5 font-medium"
              [class]="statusBadgeClass(task)"
            >
              {{ task.isCompleted ? 'Completed' : 'Pending' }}
            </span>
          </div>
        </section>
        }
      </div>
      } @else {
      <div
        class="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border px-6 py-10 text-center"
      >
        <p class="text-sm font-medium text-foreground">No tasks yet</p>
        <p class="text-sm text-muted-foreground">
          Once you add tasks, they’ll show up here so you can keep track of what’s next.
        </p>
      </div>
      } } }
    </section>
  `,
})
export class TasksComponent {
  private readonly tasksService = inject(TasksService);

  readonly tasks = injectQuery<Task[]>(() => ({
    queryKey: ['tasks'],
    queryFn: () => this.tasksService.getTasks(),
  }));

  refetch(): void {
    this.tasks.refetch();
  }

  priorityBadgeClass(task: Task): string {
    switch (task.priority) {
      case 'High':
        return 'bg-destructive/10 text-destructive border border-destructive/30';
      case 'Medium':
        return 'bg-amber-500/10 text-amber-700 border border-amber-500/30';
      case 'Low':
      default:
        return 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/30';
    }
  }

  statusBadgeClass(task: Task): string {
    if (task.isCompleted) {
      return 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/30';
    }

    return 'bg-muted text-muted-foreground border border-border';
  }
}
