import { Routes } from '@angular/router';
import { TaskComponent } from './task/task.component';

const lazyLoadNoPageComponent = () =>
  import('./shared/components/no-page/no-page.component').then(
    (module) => module.NoPageComponent
  );

export const routes: Routes = [
  { path: '', redirectTo: '/tasks', pathMatch: 'full' },
  {
    path: 'tasks',
    component: TaskComponent,
    loadChildren: () =>
      import('./task/task.routes').then((module) => module.routes),
  },
  { path: 'not-found', loadComponent: lazyLoadNoPageComponent },
  {
    path: '**',
    loadComponent: lazyLoadNoPageComponent,
  },
];
