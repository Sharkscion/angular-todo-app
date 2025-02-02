import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'task',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
})
export class TaskComponent {}
