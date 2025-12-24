import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePlus, lucideCheckSquare2, lucideListTodo, lucideArrowRight } from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';

import { TasksService } from '../tasks/tasks.service';
import type { Task } from '../tasks/task.model';
import { TaskCardComponent } from '../tasks/task-card.component';
import { CreateTaskDialogComponent } from '../tasks/create-task-dialog.component';
import type { ManageInfoResponse } from '../auth/auth.service';

@Component({
  selector: 'app-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    HlmCardImports,
    HlmButtonImports,
    HlmSkeletonImports,
    TaskCardComponent,
    CreateTaskDialogComponent,
    NgIcon,
    HlmIcon,
  ],
  providers: [provideIcons({ lucidePlus, lucideCheckSquare2, lucideListTodo, lucideArrowRight })],
  template: `
    <div class="space-y-8">
      <!-- Welcome Section -->
      <div>
        <h1 class="text-3xl font-bold">
          Welcome back{{ user().email ? ', ' + user().email.split('@')[0] : '' }}!
        </h1>
        <p class="text-muted-foreground mt-1">Here's an overview of your tasks</p>
      </div>

      <!-- Task Statistics -->
      @if (tasks.isPending()) {
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        @for (item of [1, 2, 3]; track item) {
        <section hlmCard>
          <div hlmCardHeader>
            <hlm-skeleton class="h-4 w-24 mb-2" />
            <hlm-skeleton class="h-8 w-16" />
          </div>
        </section>
        }
      </div>
      } @else {
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <section hlmCard>
          <div hlmCardHeader>
            <div class="flex items-center gap-2">
              <ng-icon hlm class="size-5 text-muted-foreground" name="lucideListTodo" />
              <h3 hlmCardTitle class="text-sm font-medium text-muted-foreground">Total Tasks</h3>
            </div>
            <p class="text-3xl font-bold mt-2">{{ taskStats().total }}</p>
          </div>
        </section>

        <section hlmCard>
          <div hlmCardHeader>
            <div class="flex items-center gap-2">
              <ng-icon hlm class="size-5 text-emerald-600" name="lucideCheckSquare2" />
              <h3 hlmCardTitle class="text-sm font-medium text-muted-foreground">Completed</h3>
            </div>
            <p class="text-3xl font-bold mt-2 text-emerald-600">{{ taskStats().completed }}</p>
          </div>
        </section>

        <section hlmCard>
          <div hlmCardHeader>
            <div class="flex items-center gap-2">
              <ng-icon hlm class="size-5 text-amber-600" name="lucideListTodo" />
              <h3 hlmCardTitle class="text-sm font-medium text-muted-foreground">Pending</h3>
            </div>
            <p class="text-3xl font-bold mt-2 text-amber-600">{{ taskStats().pending }}</p>
          </div>
        </section>
      </div>
      }

      <!-- Quick Actions -->
      <div class="flex flex-col sm:flex-row gap-4">
        <button hlmBtn (click)="openDialog()">
          <ng-icon hlm size="sm" name="lucidePlus" />
          Create New Task
        </button>
        <a routerLink="/tasks" hlmBtn variant="outline">
          View All Tasks
          <ng-icon hlm size="sm" name="lucideArrowRight" />
        </a>
      </div>

      <!-- Recent Tasks -->
      <div>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-2xl font-bold">Recent Tasks</h2>
          @if ((recentTasks().length > 0 || tasks.isPending()) && !tasks.isError()) {
          <a routerLink="/tasks" class="text-sm text-primary hover:underline">
            View all
            <ng-icon hlm size="sm" name="lucideArrowRight" class="inline ml-1" />
          </a>
          }
        </div>

        @if (tasks.isPending()) {
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          @for (item of [1, 2, 3]; track item) {
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
        <section hlmCard>
          <div hlmCardContent class="py-6 text-center">
            <p class="text-sm text-destructive">Something went wrong while loading your tasks.</p>
          </div>
        </section>
        } @else { @if (recentTasks().length > 0) {
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          @for (task of recentTasks(); track task.id) {
          <app-task-card
            [task]="task"
            (editTask)="onEditTask($event)"
            (deleteTask)="onDeleteTask($event)"
          />
          }
        </div>
        } @else {
        <section hlmCard>
          <div hlmCardContent class="py-6 text-center">
            <p class="text-sm text-muted-foreground mb-4">
              You don't have any tasks yet. Create your first task to get started!
            </p>
            <button hlmBtn (click)="openDialog()">
              <ng-icon hlm size="sm" name="lucidePlus" />
              Create Task
            </button>
          </div>
        </section>
        } } }
      </div>
    </div>

    <app-create-task-dialog
      [open]="dialogOpen()"
      [task]="editingTask()"
      (openChange)="onDialogOpenChange($event)"
      (success)="onTaskDialogSuccess()"
    />
  `,
})
export class DashboardComponent {
  private readonly tasksService = inject(TasksService);
  private readonly router = inject(Router);

  readonly user = input.required<ManageInfoResponse>();

  readonly dialogOpen = signal(false);
  readonly editingTask = signal<Task | null>(null);

  readonly tasks = injectQuery<Task[]>(() => ({
    queryKey: ['tasks'],
    queryFn: () => this.tasksService.getTasks(),
  }));

  readonly taskStats = computed(() => {
    const taskList = this.tasks.data() ?? [];
    const total = taskList.length;
    const completed = taskList.filter((task) => task.isCompleted).length;
    const pending = total - completed;
    return { total, completed, pending };
  });

  readonly recentTasks = computed(() => {
    const taskList = this.tasks.data() ?? [];
    // Get most recent tasks (sorted by createdAt descending), limit to 6
    return [...taskList]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 6);
  });

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
    // Navigate to task detail page where user can delete the task
    this.router.navigate(['/tasks', task.id]);
  }

  onTaskDialogSuccess() {
    // Task was created/updated, query will automatically refetch
  }
}
