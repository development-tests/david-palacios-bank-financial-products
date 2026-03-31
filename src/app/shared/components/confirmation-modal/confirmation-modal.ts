import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './confirmation-modal.html',
  styleUrl: './confirmation-modal.css',
})
export class ConfirmationModal {
  @Input() title = '';
  @Input() visible = false;
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

}
