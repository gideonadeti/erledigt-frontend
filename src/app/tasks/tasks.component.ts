import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { HlmCardImports } from '@spartan-ng/helm/card';

import { TasksService } from './tasks.service';
import type { Task } from './task.model';
import { TaskCardComponent } from './task-card.component';

@Component({
  selector: 'app-tasks',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmCardImports, DatePipe, TaskCardComponent],
  template: `
    <section class="space-y-6">
      <div>
        <div>
          <h1 class="text-3xl font-bold">Tasks</h1>
          <p class="text-muted-foreground">
            {{ taskCount() }} task{{ taskCount() !== 1 ? 's' : '' }} available
          </p>
        </div>
      </div>

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
        <app-task-card [task]="task" />
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

  readonly taskCount = computed(() => (this.tasks.data() ?? []).length);

  refetch(): void {
    this.tasks.refetch();
  }
}
