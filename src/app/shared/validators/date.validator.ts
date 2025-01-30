import { AbstractControl, ValidationErrors } from '@angular/forms';

const minDate =
  (date: Date) =>
  (control: AbstractControl<Date>): ValidationErrors | null => {
    if (control.dirty) {
      date.setHours(0, 0, 0, 0);

      let inputDate = control.value;

      if (typeof control.value === 'string') {
        inputDate = new Date(control.value);
        inputDate.setHours(0, 0, 0, 0);
      }

      if (inputDate.getTime() >= date.getTime()) {
        return null;
      }

      return {
        minDate:
          'Invalid date selection. Please pick a date that is today or later.',
      };
    }

    return null;
  };

export const DateValidator = {
  minDate: minDate,
};
