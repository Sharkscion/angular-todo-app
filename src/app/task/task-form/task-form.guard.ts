import { CanDeactivateFn } from '@angular/router';
import { TaskFormComponent } from './task-form.component';

/**Better to use CanActivate == more secure especially for business logic
 * CanDeactivate == usually for UI/cosmetics
 * **/
export const canLeaveForm: CanDeactivateFn<TaskFormComponent> = (
  component,
  currentRoute,
  currentState,
  nextState
) => {
  if (component.isSubmitting) {
    return true;
  }

  if (component.taskForm.dirty) {
    return window.confirm(
      'Are you sure you want to leave? You will lose the entered data.'
    );
  }

  return true;
};
