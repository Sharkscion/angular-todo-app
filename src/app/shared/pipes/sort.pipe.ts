import { Pipe, PipeTransform } from '@angular/core';

const compareByProperty = <T>(
  a: T,
  b: T,
  property: keyof T,
  direction: 'asc' | 'desc'
) => {
  if (a[property] < b[property]) {
    return direction === 'asc' ? -1 : 1;
  }
  if (a[property] > b[property]) {
    return direction === 'asc' ? 1 : -1;
  }
  return 0;
};

const compareByValue = <T>(a: T, b: T, direction: 'asc' | 'desc') => {
  if (a < b) {
    return direction === 'asc' ? -1 : 1;
  }
  if (a > b) {
    return direction === 'asc' ? 1 : -1;
  }
  return 0;
};

@Pipe({
  name: 'sort',
  standalone: true,
})
export class SortPipe implements PipeTransform {
  transform<T extends any>(
    value: T[],
    by: keyof T | null = null,
    direction: 'asc' | 'desc' = 'asc'
  ): T[] {
    const sorted = [...value];

    return sorted.sort((a, b) => {
      const isObject = !Array.isArray(a) && a === Object(a);

      if (by != null && isObject) {
        const key = by as keyof typeof a;
        return compareByProperty(a, b, key, direction);
      }

      return compareByValue(a, b, direction);
    });
  }
}
