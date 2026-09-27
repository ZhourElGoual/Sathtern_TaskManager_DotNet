import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Task {
  id?: number;
  title: string;
  description?: string;
  isCompleted: boolean;
  priority: string;
  category?: string;
  dueDate?: string;
}

@Injectable({ providedIn: 'root' })
export class TaskService {
  private apiUrl = 'http://localhost:5233/gateway/tasks';

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Task[]>(this.apiUrl);
  }

  create(task: Task) {
    return this.http.post<Task>(this.apiUrl, task);
  }

  update(id: number, task: Task) {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}