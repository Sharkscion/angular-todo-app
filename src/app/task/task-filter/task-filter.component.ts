import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskStatus } from '../../models/Task';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';

export type TaskFilter = TaskStatus | 'All';

interface TaskFilterOption {
  value: TaskFilter;
  text: string;
}

@Component({
  selector: 'task-filter',
  standalone: true,
  imports: [CommonModule, MatSelectModule],
  templateUrl: './task-filter.component.html',
  styleUrl: './task-filter.component.scss',
})
export class TaskFilterComponent {
  selectedFilter = input.required<TaskFilter>();

  onFilterChanged = output<TaskFilter>();

  taskFilterOptions: TaskFilterOption[] = [
    { value: 'All', text: 'All' },
    {
      value: 'Active',
      text: 'Active Tasks',
    },
    {
      value: 'Due',
      text: 'Due Tasks',
    },
    {
      value: 'Completed',
      text: 'Completed Tasks',
    },
  ];

  onChange(control: MatSelectChange) {
    this.onFilterChanged.emit(control.value as TaskFilter);
  }
}
