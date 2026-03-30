import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ProductService } from '../../core/services/product.service';


export const urlValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = control.value;
  if (!value) return null;
  try {
    new URL(value);
    return null;
  } catch {
    return { invalidUrl: true };
  }
};

export const futureOrTodayDateValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = control.value;
  if (!value) return null;

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  return value >= todayStr ? null : { pastDate: true };
};

export const oneYearAfterValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const release = control.get('date_release')?.value;
  const revision = control.get('date_revision')?.value;
  if (!release || !revision) return null;
  const releaseDate = new Date(release);
  const revisionDate = new Date(revision);
  const expectedRevision = new Date(releaseDate);
  expectedRevision.setFullYear(expectedRevision.getFullYear() + 1);
  return revisionDate.getTime() === expectedRevision.getTime() ? null : { invalidRevision: true };
};


export const uniqueIdValidator = (productService: ProductService): AsyncValidatorFn => {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value || control.value.length < 3) return of(null);
    return of(control.value).pipe(
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(id => productService.verifyId(id).pipe(
        map(exists => (exists ? { idExists: true } : null)),
        catchError(() => of(null))
      ))
    );
  };
};
