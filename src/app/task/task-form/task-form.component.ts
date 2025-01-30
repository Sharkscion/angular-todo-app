import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, computed } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, map, takeUntil } from 'rxjs';
import { NewTask, Task } from '../../models/Task';
import { TaskService } from '../../services/task.service';
import { FieldValidationErrorDirective } from '../../shared/directives/field-validation-error.directive';
import { DateValidator } from '../../shared/validators/date.validator';

@Component({
  selector: 'task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FieldValidationErrorDirective],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
})
export class TaskFormComponent implements OnInit {
  private unsubscribe$ = new Subject<void>();
  private selectedTask: Task | null = null;

  isSubmitting: boolean = false;
  isEditMode: boolean = false;

  taskForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.maxLength(32)]),
    description: new FormControl('', [
      Validators.required,
      Validators.maxLength(255),
    ]),
    dueDate: new FormControl('', [
      Validators.required,
      DateValidator.minDate(new Date()),
    ]),
  });

  isTitleFieldInvalid = () =>
    (this.isSubmitting || this.taskForm.controls.title.dirty) &&
    this.taskForm.controls.title.invalid;

  isDescriptionFieldInvalid = () =>
    (this.isSubmitting || this.taskForm.controls.description.dirty) &&
    this.taskForm.controls.description.invalid;

  isDueDateFieldInvalid = () =>
    (this.isSubmitting || this.taskForm.controls.dueDate.dirty) &&
    this.taskForm.controls.dueDate.invalid;

  constructor(
    private taskService: TaskService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data
      .pipe(
        map((data) => {
          const hasData = Object.keys(data).length > 0;
          if (!hasData) {
            return null;
          }

          return Object.keys(data).includes('selectedTask')
            ? data['selectedTask']
            : null;
        })
      )
      .subscribe({
        next: (data: Task | null) => {
          console.log('loaded Task:', data);
          this.isEditMode = data !== null ? true : false;

          if (!this.isEditMode) {
            return;
          }

          this.selectedTask = data;

          var transformedDueDate = new DatePipe('en-US').transform(
            new Date(this.selectedTask?.dueDate!),
            'yyyy-MM-dd'
          );

          this.taskForm.patchValue({
            title: this.selectedTask?.title,
            description: this.selectedTask?.description,
            dueDate: transformedDueDate,
          });

          console.log(
            'selected task DueDate:',
            new Date(this.selectedTask?.dueDate!)
          );

          console.log(this.taskForm.get('dueDate')?.errors);
        },
      });
  }

  private createTask(): void {
    const newTask: NewTask = {
      title: this.taskForm.controls.title.value!,
      description: this.taskForm.controls.description.value!,
      dueDate: new Date(this.taskForm.controls.dueDate.value!),
    };

    this.taskService
      .createTask(newTask)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        complete: () => {
          this.resetForm();
        },
      });
  }

  private updateTask(): void {
    const updatedTask: Task = {
      ...this.selectedTask!,
      title: this.taskForm.controls.title.value!,
      description: this.taskForm.controls.description.value!,
      dueDate: new Date(this.taskForm.controls.dueDate.value!),
    };

    this.taskService
      .updateTask(updatedTask)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        complete: () => {
          this.resetForm();
        },
      });
  }

  private goToHomePage() {
    this.router.navigateByUrl('/');
  }

  private validateAllFormFields() {
    this.taskForm.markAllAsTouched();
  }

  onSubmit() {
    this.isSubmitting = true;
    if (this.taskForm.invalid) {
      this.validateAllFormFields();
      return;
    }

    if (this.isEditMode) {
      this.updateTask();
    } else {
      this.createTask();
    }
  }

  resetForm() {
    this.isSubmitting = false;
    this.taskForm.reset();
    this.goToHomePage();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
