import { Component, input, output } from '@angular/core';
import { Task, TaskStatus } from '../../models/Task';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'task-item',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.scss',
})
export class TaskItemComponent {
  task = input.required<Task>();

  complete = output<number>();
  delete = output<number>();
  edit = output<number>();

  onTaskComplete(taskId: number) {
    this.complete.emit(taskId);
  }

  onTaskDelete(taskId: number) {
    this.delete.emit(taskId);
  }

  onTaskEdit(taskId: number) {
    this.edit.emit(taskId);
  }

  getStatusLabelClassStyle(status: TaskStatus): string {
    if (status === 'Completed') {
      return 'completed';
    }

    if (status === 'Due') {
      return 'due';
    }

    return 'active';
  }
}
