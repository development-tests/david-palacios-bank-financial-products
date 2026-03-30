import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, throwError } from "rxjs";
import { NotificationService } from "../services/notification.service";

export const errorInterceptor: HttpInterceptorFn = ( req, next ) => {
  const notification = inject(NotificationService);

  return next(req).pipe(
    catchError((error) => {
      let errorMsg = 'An unexpected error occurred';
      if (error.error?.message) {
        errorMsg = error.error?.message;
      } else if (error.message) {
        errorMsg = error.message;
      }

      notification.showError(errorMsg);
      return throwError(() => error);
    })
  );


};
