import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheckSquare } from '@ng-icons/lucide';

import { TasksService } from './tasks.service';
import type { Task } from './task.model';
import { TaskCardComponent } from './task-card.component';

@Component({
  selector: 'app-tasks',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmCardImports, TaskCardComponent, HlmEmptyImports, HlmButtonImports, NgIcon],
  providers: [provideIcons({ lucideCheckSquare })],
  template: `
    <section class="space-y-6">
      @if (tasks.isPending() || tasks.isError() || (tasks.data() ?? []).length > 0) {
      <div>
        <div>
          <h1 class="text-3xl font-bold">Tasks</h1>
          <p class="text-muted-foreground">
            {{ taskCount() }} task{{ taskCount() !== 1 ? 's' : '' }} available
          </p>
        </div>
      </div>
      } @if (tasks.isPending()) {
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
      <div hlmEmpty>
        <div hlmEmptyHeader>
          <div hlmEmptyMedia variant="icon">
            <ng-icon name="lucideCheckSquare" />
          </div>
          <div hlmEmptyTitle>No Tasks Yet</div>
          <div hlmEmptyDescription>
            You haven&apos;t created any tasks yet. Get started by creating your first task.
          </div>
        </div>
        <div hlmEmptyContent>
          <button hlmBtn>Create Task</button>
        </div>
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
