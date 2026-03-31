import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, throwError } from "rxjs";
import { ToastService } from "../../services/toast/toast.service";

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);
  return next(req).pipe(
    catchError((error) => {
      let errorMsg = 'Ocurrió un error inesperado';

      // Si el backend devolvió un mensaje en el cuerpo de la respuesta
      if (error.error?.message) {
        errorMsg = error.error.message;
      }

      // Si se trata de un error de red del lado del cliente (estado 0)
      else if (error.status === 0) {
        errorMsg = 'Error de conexión. Verifique su red.';
      }

      // Para errores HTTP sin un mensaje personalizado
      else if (error.status && error.status >= 500) {
        errorMsg = 'Ocurrió un error inesperado';
      }

      // Si está disponible, utilizar error.message.
      else if (error.message) {
        errorMsg = error.message;
      }

      toast.showError(errorMsg);
      console.error('HTTP Error:', error);
      return throwError(() => error);
    })
  );
};
