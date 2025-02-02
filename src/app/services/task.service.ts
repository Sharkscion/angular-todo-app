import { Injectable, signal } from '@angular/core';
import { TaskApiService } from './task-api.service';
import { NewTask, Task, TaskStatus } from '../models/Task';
import { Observable, lastValueFrom, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private _tasks = signal<Task[]>([]);
  allTasks = this._tasks.asReadonly();

  constructor(private taskApiService: TaskApiService) {}

  /*Can use lastValueFrom here.
   * No need to do Observables here*/

  completeTask(taskId: number): Observable<Task> {
    return this.taskApiService.completeTask(taskId).pipe(
      tap((updateTask) =>
        this._tasks.update((prevTask) =>
          prevTask.map((task) => {
            if (task.id !== updateTask.id) {
              return task;
            }

            return {
              ...updateTask,
            };
          })
        )
      )
    );
  }

  createTask(data: NewTask): Observable<Task> {
    data.isCompleted = false;

    return this.taskApiService
      .createTask(data)
      .pipe(tap((newTask) => this._tasks.set([...this._tasks(), newTask])));
  }

  deleteTask(taskId: number): Observable<void> {
    return this.taskApiService.deleteTask(taskId).pipe(
      tap(() => {
        this._tasks.update((prevTask) =>
          prevTask.filter((item) => item.id !== taskId)
        );
      })
    );
  }

  async findTask(taskId: number): Promise<Task | null> {
    if (this._tasks().length > 0) {
      const foundTask = this._tasks().find((item) => item.id === taskId);
      return !foundTask ? null : foundTask;
    }

    const response = await lastValueFrom(this.taskApiService.findTask(taskId));

    return !response ? null : response;
  }

  filterTasks(status: TaskStatus): Task[] {
    return this.allTasks().filter((task) => task.status === status);
  }

  getTasks(): Observable<Task[]> {
    return this.taskApiService.getTasks().pipe(
      map((task) => {
        return task.map((item) => {
          return {
            ...item,
            status: this.generateStatus(item),
          };
        });
      }),

      tap((tasks) => {
        this._tasks.set(tasks);
      })
    );
  }

  updateTask(data: Task): Observable<Task> {
    return this.taskApiService.updateTask(data).pipe(
      tap((updateTask) =>
        this._tasks.update((prevTask) =>
          prevTask.map((task) => {
            if (task.id !== updateTask.id) {
              return task;
            }

            return {
              ...updateTask,
            };
          })
        )
      )
    );
  }

  private isTaskDue(task: Task): boolean {
    return (
      !task.isCompleted &&
      new Date(task.dueDate).getTime() <= new Date().getTime()
    );
  }

  private generateStatus(task: Task): TaskStatus {
    if (this.isTaskDue(task)) {
      return 'Due';
    }

    if (task.isCompleted) {
      return 'Completed';
    }

    return 'Active';
  }
}
