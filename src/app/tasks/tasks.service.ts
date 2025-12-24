import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import type { Task } from './task.model';

const API_BASE = 'http://localhost:5211';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private readonly http = inject(HttpClient);

  getTasks() {
    return firstValueFrom(
      this.http.get<Task[]>(`${API_BASE}/api/TodoTasks`, {
        withCredentials: true,
      })
    );
  }

  toggleTaskCompletion(id: number, isCompleted: boolean) {
    return firstValueFrom(
      this.http.patch<Task>(
        `${API_BASE}/api/TodoTasks/${id}/completion`,
        { isCompleted },
        {
          withCredentials: true,
        }
      )
    );
  }

  createTask(data: {
    title: string;
    description?: string | null;
    priority: 1 | 2 | 3;
    dueDate?: string | null;
  }) {
    return firstValueFrom(
      this.http.post<Task>(`${API_BASE}/api/TodoTasks`, data, {
        withCredentials: true,
      })
    );
  }

  updateTask(id: number, data: {
    title: string;
    description?: string | null;
    priority: 1 | 2 | 3;
    dueDate?: string | null;
  }) {
    return firstValueFrom(
      this.http.put<Task>(`${API_BASE}/api/TodoTasks/${id}`, data, {
        withCredentials: true,
      })
    );
  }
}
