import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { injectMutation, QueryClient } from '@tanstack/angular-query-experimental';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideX } from '@ng-icons/lucide';
import { toast } from 'ngx-sonner';
import { BrnDialogImports } from '@spartan-ng/brain/dialog';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmFieldImports } from '@spartan-ng/helm/field';
import { HlmFormFieldImports } from '@spartan-ng/helm/form-field';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmTextareaImports } from '@spartan-ng/helm/textarea';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmDatePickerImports } from '@spartan-ng/helm/date-picker';

import { TasksService } from './tasks.service';
import type { Task, TaskPriority } from './task.model';
import { DialogFooterComponent } from './dialog-footer.component';

@Component({
  selector: 'app-create-task-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideIcons({ lucideX })],
  imports: [
    ReactiveFormsModule,
    HlmDialogImports,
    BrnDialogImports,
    BrnSelectImports,
    HlmFieldImports,
    HlmFormFieldImports,
    HlmInputImports,
    HlmSelectImports,
    HlmTextareaImports,
    HlmLabelImports,
    HlmDatePickerImports,
    HlmIcon,
    NgIcon,
    DialogFooterComponent,
  ],
  template: `
    <hlm-dialog [state]="dialogState()" (closed)="onClosed()">
      <hlm-dialog-content *brnDialogContent="let ctx" class="w-full max-w-[600px] sm:w-[600px]">
        <hlm-dialog-header>
          <h3 hlmDialogTitle>{{ isEditMode() ? 'Edit Task' : 'Add New Task' }}</h3>
          <p hlmDialogDescription>
            {{
              isEditMode()
                ? 'Update the task details below. All fields marked with * are required.'
                : 'Fill in the details below to add a new task. All fields marked with * are required.'
            }}
          </p>
        </hlm-dialog-header>

        <form [formGroup]="form" class="space-y-4">
          <fieldset hlmFieldSet>
            <div hlmFieldGroup>
              <hlm-form-field>
                <label hlmLabel>Title <span class="text-destructive">*</span></label>
                <input hlmInput formControlName="title" placeholder="Enter task title" required />
                <hlm-error>Title is required.</hlm-error>
              </hlm-form-field>

              <hlm-form-field>
                <label hlmLabel>Description</label>
                <textarea
                  hlmTextarea
                  formControlName="description"
                  placeholder="Enter task description (optional)"
                  class="resize-none h-24"
                ></textarea>
              </hlm-form-field>

              <div hlmField [attr.data-invalid]="priorityInvalid() ? true : null">
                <label hlmFieldLabel for="field-select-priority"
                  >Priority <span class="text-destructive">*</span></label
                >
                <brn-select formControlName="priority" placeholder="Select priority">
                  <hlm-select-trigger class="w-full" id="field-select-priority">
                    <hlm-select-value />
                  </hlm-select-trigger>
                  <hlm-select-content>
                    <hlm-option [value]="1">Low</hlm-option>
                    <hlm-option [value]="2">Medium</hlm-option>
                    <hlm-option [value]="3">High</hlm-option>
                  </hlm-select-content>
                </brn-select>
                @if (priorityInvalid()) {
                <hlm-field-error>Priority is required.</hlm-field-error>
                }
              </div>

              <div class="flex gap-4">
                <div class="flex flex-col gap-2 flex-1">
                  <label for="date-picker" hlmLabel class="px-1">Due Date</label>
                  <div class="flex items-center gap-2">
                    <hlm-date-picker
                      buttonId="date-picker"
                      [min]="minDate"
                      [max]="maxDate"
                      formControlName="dueDate"
                      [autoCloseOnSelect]="true"
                      captionLayout="dropdown"
                      class="flex-1"
                    >
                      <span>Select date</span>
                    </hlm-date-picker>
                    @if (form.controls.dueDate.value) {
                    <button
                      type="button"
                      (click)="clearDueDate()"
                      class="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                      aria-label="Clear date"
                    >
                      <ng-icon hlm size="sm" name="lucideX" />
                    </button>
                    }
                  </div>
                </div>

                <hlm-form-field class="flex-1">
                  <label hlmLabel>Time</label>
                  <input
                    hlmInput
                    id="time-picker"
                    type="time"
                    step="1"
                    formControlName="time"
                    class="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                  />
                </hlm-form-field>
              </div>
            </div>
          </fieldset>
        </form>

        <app-dialog-footer
          [isPending]="taskMutation.isPending()"
          [disabled]="!form.dirty"
          [text]="isEditMode() ? 'Update Task' : 'Add Task'"
          [pendingText]="isEditMode() ? 'Updating...' : 'Adding...'"
          [handleCancel]="closeDialog"
          [handleSubmit]="onSubmit"
        />
      </hlm-dialog-content>
    </hlm-dialog>
  `,
})
export class CreateTaskDialogComponent {
  private readonly tasksService = inject(TasksService);
  private readonly queryClient = inject(QueryClient);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  readonly open = input(false);
  readonly task = input<Task | null>(null);
  readonly openChange = output<boolean>();
  readonly success = output<void>();

  readonly minDate = new Date(2020, 0, 1);
  readonly maxDate = new Date(2050, 11, 31);

  readonly dialogState = computed<'open' | 'closed'>(() => (this.open() ? 'open' : 'closed'));
  readonly isEditMode = computed(() => this.task() !== null);

  readonly form = this.fb.group({
    title: ['', [Validators.required]],
    description: [''],
    priority: [2 as TaskPriority, [Validators.required]],
    time: [''],
    dueDate: [null as Date | null],
  });

  readonly taskMutation = injectMutation(() => ({
    mutationFn: (data: {
      id?: number;
      title: string;
      description?: string | null;
      priority: TaskPriority;
      dueDate?: string | null;
    }) => {
      if (data.id) {
        return this.tasksService.updateTask(data.id, {
          title: data.title,
          description: data.description,
          priority: data.priority,
          dueDate: data.dueDate,
        });
      }
      return this.tasksService.createTask({
        title: data.title,
        description: data.description,
        priority: data.priority,
        dueDate: data.dueDate,
      });
    },
    onSuccess: (_, variables) => {
      this.queryClient.invalidateQueries({ queryKey: ['tasks'] });
      this.resetForm();
      this.closeDialog();

      if (variables.id) {
        toast.success('Task updated successfully', {
          description: `"${variables.title}" has been updated`,
        });
      } else {
        toast.success('Task created successfully', {
          description: `"${variables.title}" has been added to your tasks`,
        });
      }

      this.success.emit();
    },
  }));

  readonly priorityInvalid = computed(() => {
    const control = this.form.controls.priority;
    return control.invalid && (control.dirty || control.touched);
  });

  constructor() {
    // When a date is selected, automatically set the current time if time is empty
    this.form.controls.dueDate.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((dueDate) => {
        if (dueDate && !this.form.controls.time.value) {
          const now = new Date();
          const hours = String(now.getHours()).padStart(2, '0');
          const minutes = String(now.getMinutes()).padStart(2, '0');
          this.form.controls.time.setValue(`${hours}:${minutes}`, { emitEvent: false });
        }
      });

    // Populate form when task input changes (for edit mode)
    effect(() => {
      const task = this.task();
      const isOpen = this.open();
      if (isOpen && task) {
        // Populate form when dialog opens with a task (edit mode)
        this.populateForm(task);
      } else if (isOpen && !task) {
        // Reset form when dialog opens without a task (create mode)
        this.resetForm();
      }
    });
  }

  clearDueDate() {
    this.form.controls.dueDate.setValue(null);
    this.form.controls.time.setValue('');
  }

  onClosed() {
    this.resetForm();
    this.openChange.emit(false);
  }

  closeDialog = () => {
    this.openChange.emit(false);
  };

  populateForm(task: Task) {
    let dueDate: Date | null = null;
    let time = '';

    if (task.dueDate) {
      const date = new Date(task.dueDate);
      dueDate = date;
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      time = `${hours}:${minutes}`;
    }

    this.form.reset({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      dueDate,
      time,
    });
  }

  resetForm() {
    this.form.reset({
      title: '',
      description: '',
      priority: 2,
      dueDate: null,
      time: '',
    });
  }

  onSubmit = () => {
    if (this.form.invalid) {
      this.form.markAllAsTouched();

      return;
    }

    const formValue = this.form.getRawValue();
    let dueDate: string | null = null;

    if (formValue.dueDate) {
      const date = new Date(formValue.dueDate);
      if (formValue.time) {
        const [hours, minutes] = formValue.time.split(':');
        date.setHours(Number.parseInt(hours, 10), Number.parseInt(minutes, 10), 0, 0);
      }
      dueDate = date.toISOString();
    }

    // Form is validated, so title and priority are guaranteed to have values
    const task = this.task();
    this.taskMutation.mutate({
      id: task?.id,
      title: formValue.title!,
      description: formValue.description || null,
      priority: formValue.priority!,
      dueDate,
    });
  };
}
