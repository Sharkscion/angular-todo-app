import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, signal } from '@angular/core';
import { Observable, catchError, of, throwError } from 'rxjs';
import {
  ENVIRONMENT_TOKEN,
  Environment,
} from '../../environments/environment.model';
import { NewTask, Task } from '../models/Task';

@Injectable({
  providedIn: 'root',
})
export class TaskApiService {
  private baseUrl = '';

  error = signal<string | null>(null);

  constructor(
    @Inject(ENVIRONMENT_TOKEN) private environment: Environment,
    private httpClient: HttpClient
  ) {
    this.baseUrl = `${this.environment.apiUrl}/todos`;
  }

  completeTask(taskId: number): Observable<Task> {
    const url = `${this.baseUrl}\\${taskId}`;

    return this.httpClient
      .patch<Task>(url, {
        isCompleted: true,
      })
      .pipe(
        catchError((error) => {
          console.error(error);
          const message = 'Failed to complete the task.';
          this.error.set(message);
          return throwError(() => new Error(message));
        })
      );
  }

  createTask(data: NewTask): Observable<Task> {
    return this.httpClient.post<Task>(this.baseUrl, data).pipe(
      catchError((error) => {
        console.error(error);
        const message = 'Failed to create a new task.';
        return throwError(() => new Error(message));
      })
    );
  }

  deleteTask(taskId: number): Observable<void> {
    const url = `${this.baseUrl}\\${taskId}`;

    return this.httpClient.delete<void>(url).pipe(
      catchError((error) => {
        console.log(error);

        const message = 'Failed to delete task';
        this.error.set(message);
        return throwError(() => new Error(message));
      })
    );
  }

  findTask(taskId: number): Observable<Task | null> {
    const url = `${this.baseUrl}\\${taskId}`;

    return this.httpClient.get<Task>(url).pipe(
      catchError((error) => {
        console.log('Logging Error:', error);
        return of(null);
      })
    );
  }

  getTasks(): Observable<Task[]> {
    return this.httpClient.get<Task[]>(this.baseUrl).pipe(
      catchError((error) => {
        console.error(error);

        const message = 'Failed to fetch all tasks.';
        this.error.set(message);
        return throwError(() => new Error(message));
      })
    );
  }

  updateTask(data: Task): Observable<Task> {
    const url = `${this.baseUrl}\\${data.id}`;

    return this.httpClient.put<Task>(url, data).pipe(
      catchError((error) => {
        console.error(error);
        const message = 'Failed to update the task.';
        this.error.set(message);
        return throwError(() => new Error(message));
      })
    );
  }
}
