import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  injectMutation,
  injectQuery,
  injectQueryClient,
} from '@tanstack/angular-query-experimental';
import { format, isPast, isToday, isTomorrow, isYesterday } from 'date-fns';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowLeft } from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';

import { TasksService } from './tasks.service';
import type { Task } from './task.model';

@Component({
  selector: 'app-task',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    HlmCardImports,
    HlmBadgeImports,
    HlmButtonImports,
    HlmSkeletonImports,
    NgIcon,
    HlmIcon,
  ],
  providers: [provideIcons({ lucideArrowLeft })],
  template: `
    <section class="space-y-6">
      <div>
        <a routerLink="/tasks" hlmBtn variant="ghost" size="sm" class="mb-4">
          <ng-icon hlm size="sm" name="lucideArrowLeft" />
          Back to Tasks
        </a>

        @if (taskQuery.isPending()) {
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1 space-y-4">
            <hlm-skeleton class="h-9 w-64 mb-2" />
            <hlm-skeleton class="h-5 w-48" />
          </div>
          <hlm-skeleton class="h-10 w-40" />
        </div>
        } @else { @if (taskQuery.isError() || !task()) {
        <div class="space-y-3">
          <h1 class="text-3xl font-bold">Task Not Found</h1>
          <p class="text-sm text-destructive">
            The task you're looking for doesn't exist or couldn't be loaded.
          </p>
        </div>
        } @else {
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1">
            <h1 class="text-3xl font-bold" [class.line-through]="task()?.isCompleted">
              {{ task()?.title }}
            </h1>
            <p class="text-muted-foreground mt-2">
              <span hlmBadge [class]="priorityBadgeClass(task()!)">
                {{ priorityLabel(task()!) }}
              </span>
            </p>
          </div>
          @if (task(); as currentTask) {
          <button
            hlmBtn
            [variant]="currentTask.isCompleted ? 'outline' : 'default'"
            (click)="onToggleCompletion()"
            [disabled]="toggleCompletionMutation.isPending()"
          >
            {{ currentTask.isCompleted ? 'Mark as Pending' : 'Mark as Complete' }}
          </button>
          }
        </div>
        } } @if (taskQuery.isPending()) {
        <section hlmCard class="mt-6">
          <div hlmCardHeader>
            <hlm-skeleton class="h-6 w-32" />
          </div>
          <div hlmCardContent class="space-y-2">
            <hlm-skeleton class="h-4 w-full" />
            <hlm-skeleton class="h-4 w-full" />
            <hlm-skeleton class="h-4 w-3/4" />
          </div>
          <div hlmCardFooter>
            <hlm-skeleton class="h-4 w-48" />
          </div>
        </section>
        } @else { @if (task(); as currentTask) {
        <section hlmCard class="mt-6">
          <div hlmCardHeader>
            <h2 hlmCardTitle>Description</h2>
          </div>
          <p
            hlmCardContent
            class="text-sm text-muted-foreground whitespace-pre-wrap"
            [class.line-through]="currentTask.isCompleted"
          >
            {{ currentTask.description || 'No description provided.' }}
          </p>
          <div hlmCardFooter class="flex flex-wrap items-center justify-between gap-4 text-sm">
            <div class="flex items-center gap-1 text-muted-foreground">
              <span class="font-medium" [class.line-through]="currentTask.isCompleted">Due:</span>
              <span
                [class]="dueDateClass(currentTask)"
                [class.line-through]="currentTask.isCompleted"
              >
                {{ formatDueDateDisplay(currentTask) }}
              </span>
            </div>
          </div>
        </section>
        } }
      </div>
    </section>
  `,
})
export class TaskComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly tasksService = inject(TasksService);
  private readonly queryClient = injectQueryClient();

  readonly taskQuery = injectQuery<Task[]>(() => ({
    queryKey: ['tasks'],
    queryFn: () => this.tasksService.getTasks(),
  }));

  readonly taskId = computed(() => {
    const id = this.route.snapshot.paramMap.get('id');

    return id ? Number.parseInt(id, 10) : null;
  });

  readonly task = computed(() => {
    const id = this.taskId();
    const tasks = this.taskQuery.data();
    if (!id || !tasks) {
      return null;
    }
    return tasks.find((t) => t.id === id) ?? null;
  });

  readonly toggleCompletionMutation = injectMutation(() => ({
    mutationFn: (isCompleted: boolean) => {
      const id = this.taskId();

      if (!id) {
        throw new Error('Task ID not found');
      }

      return this.tasksService.toggleTaskCompletion(id, isCompleted);
    },
    onMutate: async (isCompleted, context) => {
      const id = this.taskId();

      if (!id) return;

      // Cancel any outgoing refetches
      await context.client.cancelQueries({ queryKey: ['tasks'] });

      // Snapshot the previous value
      const previousTasks = context.client.getQueryData<Task[]>(['tasks']);

      // Optimistically update to the new value
      context.client.setQueryData<Task[]>(['tasks'], (old) => {
        if (!old) return old;

        return old.map((task) => (task.id === id ? { ...task, isCompleted } : task));
      });

      // Return a result object with the snapshotted value
      return { previousTasks };
    },
    // If the mutation fails, use the result returned from onMutate to roll back
    onError: (_, __, onMutateResult, context) => {
      if (onMutateResult?.previousTasks) {
        context.client.setQueryData(['tasks'], onMutateResult.previousTasks);
      }
    },
    // Always refetch after error or success
    onSettled: () => {
      this.queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  }));

  onToggleCompletion(): void {
    const currentTask = this.task();

    if (!currentTask) {
      return;
    }

    const newStatus = !currentTask.isCompleted;

    this.toggleCompletionMutation.mutate(newStatus);
  }

  formatDueDateDisplay(task: Task): string {
    if (!task.dueDate) {
      return 'No due date';
    }
    return this.formatDueDate(task.dueDate);
  }

  formatDueDate(dueDate: string): string {
    const date = new Date(dueDate);

    if (isToday(date)) {
      return format(date, 'h:mm a');
    }

    if (isTomorrow(date)) {
      return `Tomorrow at ${format(date, 'h:mm a')}`;
    }

    if (isYesterday(date)) {
      return `Yesterday at ${format(date, 'h:mm a')}`;
    }

    return `${format(date, 'MMM d, yyyy')} at ${format(date, 'h:mm a')}`;
  }

  dueDateClass(task: Task): string {
    if (!task.dueDate || task.isCompleted) {
      return 'text-muted-foreground';
    }

    const date = new Date(task.dueDate);

    if (isPast(date) && !isToday(date)) {
      return 'text-destructive font-medium';
    }

    if (isToday(date)) {
      return 'text-amber-600 font-medium';
    }

    return 'text-muted-foreground';
  }

  priorityLabel(task: Task): string {
    switch (task.priority) {
      case 3:
        return 'High';
      case 2:
        return 'Medium';
      case 1:
      default:
        return 'Low';
    }
  }

  priorityBadgeClass(task: Task): string {
    switch (task.priority) {
      case 3:
        return 'bg-destructive/10 text-destructive border border-destructive/30';
      case 2:
        return 'bg-amber-500/10 text-amber-700 border border-amber-500/30';
      case 1:
      default:
        return 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/30';
    }
  }
}
