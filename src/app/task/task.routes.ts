import { Routes } from '@angular/router';
import { canLeaveForm } from './task-form/task-form.guard';
import { resolveTargetTask } from './task-form/task-form.resolver';
import { TaskFormComponent } from './task-form/task-form.component';
import { TaskListComponent } from './task-list/task-list.component';

export const routes: Routes = [
  { path: '', component: TaskListComponent },
  {
    path: 'create',
    component: TaskFormComponent,
    canDeactivate: [canLeaveForm],
  },
  {
    path: 'edit/:id',
    component: TaskFormComponent,
    resolve: {
      selectedTask: resolveTargetTask,
    },
    canDeactivate: [canLeaveForm],
  },
];
