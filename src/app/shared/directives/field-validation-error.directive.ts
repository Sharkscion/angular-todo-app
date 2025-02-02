import {
  Directive,
  ElementRef,
  OnChanges,
  SimpleChanges,
  input,
} from '@angular/core';
import { ValidationErrors } from '@angular/forms';

const DEFAULT_ERROR_MESSAGE = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
};

@Directive({
  selector: '[validationErrors]',
  standalone: true,
})
export class FieldValidationErrorDirective implements OnChanges {
  validationErrors = input.required<ValidationErrors | null | undefined>();

  constructor(private elementRef: ElementRef<HTMLParagraphElement>) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.updateErrorMessage();
  }

  private generateErrorMessage(): string {
    if (!this.validationErrors()) {
      return '';
    }

    const errors = Object.entries(this.validationErrors()!);

    if (errors.length == 0) return '';

    const [key, errorMessage] = errors[0];

    if (Object.keys(DEFAULT_ERROR_MESSAGE).includes(key)) {
      return DEFAULT_ERROR_MESSAGE[key as keyof typeof DEFAULT_ERROR_MESSAGE];
    }

    if (key == 'maxlength') {
      return `Please limit your input to ${errorMessage['requiredLength']} characters`;
    }

    return errorMessage;
  }

  private updateErrorMessage() {
    this.elementRef.nativeElement.textContent = this.generateErrorMessage();
  }
}
