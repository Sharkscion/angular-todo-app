import { CommonModule } from '@angular/common';
import { Component, OnDestroy, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { TaskService } from '../../services/task.service';
import { SortPipe } from '../../shared/pipes/sort.pipe';
import { TaskItemComponent } from '../task-item/task-item.component';
import {
  TaskFilter,
  TaskFilterComponent,
} from '../task-filter/task-filter.component';
import { TaskStatus } from '../../models/Task';

@Component({
  selector: 'task-list',
  standalone: true,
  imports: [CommonModule, SortPipe, TaskFilterComponent, TaskItemComponent],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent implements OnDestroy {
  private unsubscribe$ = new Subject<void>();

  selectedFilter = signal<TaskFilter>('All');

  tasks = computed(() =>
    this.selectedFilter() == 'All'
      ? this.taskService.allTasks()
      : this.taskService.filterTasks(this.selectedFilter() as TaskStatus)
  );

  constructor(private taskService: TaskService, private router: Router) {}

  ngOnInit(): void {
    console.log('Calling on OnInit...');
    this.fetchTasks();
  }

  private fetchTasks(): void {
    this.taskService.getTasks().pipe(takeUntil(this.unsubscribe$)).subscribe();
  }

  onFilterChanged(newFilter: TaskFilter) {
    this.selectedFilter.set(newFilter);
  }

  onTaskComplete(taskId: number): void {
    this.taskService
      .completeTask(taskId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe();
  }

  onTaskDelete(taskId: number): void {
    this.taskService
      .deleteTask(taskId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe();
  }

  onTaskEdit(taskId: number): void {
    this.router.navigate(['tasks/edit', taskId]);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
