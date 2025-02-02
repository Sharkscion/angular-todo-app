import { InjectionToken } from '@angular/core';

export interface Environment {
  readonly apiUrl: string;
}

export const ENVIRONMENT_TOKEN = new InjectionToken<Environment>(
  'environment-token'
);
