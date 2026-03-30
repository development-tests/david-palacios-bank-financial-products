import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class NotificationService {

  showError( message: string ): void {
    alert(`Error: ${ message }`);
  }

  showSuccess( message: string ): void {
    alert(`Success: ${message}`);
  }

}
