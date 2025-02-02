import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Task } from '../../models/Task';
import { TaskService } from '../../services/task.service';

export const resolveTargetTask: ResolveFn<Task | null | undefined> = async (
  activatedRouteSnapShot: ActivatedRouteSnapshot,
  routeState: RouterStateSnapshot
) => {
  const router = inject(Router);

  const taskId = activatedRouteSnapShot.params['id'];
  if (!taskId) {
    router.navigate(['not-found'], {
      replaceUrl: true,
    });
    return null;
  }

  const taskService = inject(TaskService);

  const response = await taskService.findTask(parseInt(taskId!));

  console.log('Task Found:', response);

  if (!response) {
    router.navigate(['not-found'], {
      replaceUrl: true,
    });
    return null;
  }

  console.log('Found task:', JSON.stringify(response));
  return response;
};
