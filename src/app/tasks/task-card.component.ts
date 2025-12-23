import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { format, isPast, isToday, isTomorrow, isYesterday } from 'date-fns';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMoreHorizontal } from '@ng-icons/lucide';
import { HlmIcon } from '@spartan-ng/helm/icon';

import type { Task } from './task.model';

@Component({
  selector: 'app-task-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    HlmCardImports,
    HlmBadgeImports,
    HlmDropdownMenuImports,
    HlmButtonImports,
    NgIcon,
    HlmIcon,
  ],
  providers: [provideIcons({ lucideMoreHorizontal })],
  template: `
    <section hlmCard class="flex flex-col justify-between">
      <div hlmCardHeader class="flex items-start justify-between gap-2">
        <div class="flex-1">
          <h2
            hlmCardTitle
            class="text-base font-semibold text-foreground line-clamp-2"
            [class.line-through]="task().isCompleted"
          >
            {{ task().title }}
          </h2>
        </div>

        <button [hlmDropdownMenuTrigger]="menu" hlmBtn variant="ghost" size="icon-sm">
          <ng-icon hlm size="sm" name="lucideMoreHorizontal" />
        </button>
      </div>

      <p
        hlmCardContent
        class="text-sm text-muted-foreground line-clamp-2"
        [class.line-through]="task().isCompleted"
      >
        {{ task().description || 'No description provided.' }}
      </p>

      <div hlmCardFooter class="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div class="flex items-center gap-1 text-muted-foreground">
          <span class="font-medium" [class.line-through]="task().isCompleted">Due:</span>
          <span [class]="dueDateClass(task())" [class.line-through]="task().isCompleted">
            {{ formatDueDateDisplay(task()) }}
          </span>
        </div>

        <span hlmBadge [class]="priorityBadgeClass(task())">
          {{ priorityLabel(task()) }}
        </span>
      </div>
    </section>

    <ng-template #menu>
      <hlm-dropdown-menu>
        <hlm-dropdown-menu-group>
          <button hlmDropdownMenuItem>View</button>
          <hlm-dropdown-menu-separator />
          @if (!task().isCompleted) {
          <button hlmDropdownMenuItem>Mark as Complete</button>
          } @else {
          <button hlmDropdownMenuItem>Mark as Pending</button>
          }
          <button hlmDropdownMenuItem>Edit</button>
          <hlm-dropdown-menu-separator />
          <button hlmDropdownMenuItem variant="destructive">Delete</button>
        </hlm-dropdown-menu-group>
      </hlm-dropdown-menu>
    </ng-template>
  `,
})
export class TaskCardComponent {
  readonly task = input.required<Task>();

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
