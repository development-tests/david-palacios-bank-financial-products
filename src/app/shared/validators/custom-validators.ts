import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError, debounceTime, switchMap } from 'rxjs/operators';
import { ProductService } from '../../core/services/product.service';


export const urlValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
  return control.value && !urlPattern.test(control.value) ? { invalidUrl: true } : null;
};


export const futureOrTodayDateValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = control.value;
  if (!value) return null;
  const inputDate = new Date(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return inputDate >= today ? null : { pastDate: true };
};


export const oneYearAfterValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const release = control.get('date_release')?.value;
  const revision = control.get('date_revision')?.value;
  if (!release || !revision) return null;
  const releaseDate = new Date(release);
  const revisionDate = new Date(revision);
  const expectedRevision = new Date(releaseDate);
  expectedRevision.setFullYear(expectedRevision.getFullYear() + 1);
  if (revisionDate.getTime() === expectedRevision.getTime()) {
    return null;
  }
  return { invalidRevision: true };
};


export const uniqueIdValidator = (productService: ProductService): AsyncValidatorFn => {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) return of(null);
    return productService.verifyId(control.value).pipe(
      map((exists) => (exists ? { idExists: true } : null)),
      catchError(() => of(null))
    );
  };
};
