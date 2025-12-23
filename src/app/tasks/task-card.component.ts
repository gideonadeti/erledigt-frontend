import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';

import type { Task } from './task.model';

@Component({
  selector: 'app-task-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmCardImports, HlmBadgeImports, DatePipe],
  template: `
    <section hlmCard class="flex flex-col justify-between">
      <div hlmCardHeader class="flex items-start justify-between gap-2">
        <div>
          <h2 hlmCardTitle class="text-base font-semibold text-foreground line-clamp-2">
            {{ task().title }}
          </h2>
        </div>

        <span hlmBadge [class]="priorityBadgeClass(task())">
          {{ priorityLabel(task()) }}
        </span>
      </div>

      <p hlmCardContent class="text-sm text-muted-foreground line-clamp-3">
        {{ task().description || 'No description provided.' }}
      </p>

      <div hlmCardFooter class="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div class="flex items-center gap-1 text-muted-foreground">
          <span class="font-medium">Due:</span>
          <span>
            {{ task().dueDate ? (task().dueDate | date : 'mediumDate') : 'No due date' }}
          </span>
        </div>

        <span hlmBadge [class]="statusBadgeClass(task())">
          {{ task().isCompleted ? 'Completed' : 'Pending' }}
        </span>
      </div>
    </section>
  `,
})
export class TaskCardComponent {
  readonly task = input.required<Task>();

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

  statusBadgeClass(task: Task): string {
    if (task.isCompleted) {
      return 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/30';
    }

    return 'bg-muted text-muted-foreground border border-border';
  }
}
