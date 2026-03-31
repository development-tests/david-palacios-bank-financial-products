import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DropdownService {
  private closeAllSubject = new Subject<void>();
  closeAll$ = this.closeAllSubject.asObservable();

  closeAll() {
    this.closeAllSubject.next();
  }
}
