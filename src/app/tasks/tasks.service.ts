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
}
