import { Component, Input, Output, EventEmitter, ElementRef, HostListener, OnDestroy  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { DropdownService } from '../../../core/services/dropdown/dropdown.service';

@Component({
  selector: 'app-dropdown-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropdown-menu.html',
  styleUrl: './dropdown-menu.css',
})
export class DropdownMenu {
  @Input() productId!: string;
  @Output() edit = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();

  private subscription: Subscription;

  isOpen = false;
  menuTop = 0;
  menuLeft = 0;

  constructor(
    private elementRef: ElementRef,
    private dropdownService: DropdownService
  ) {
    this.subscription = this.dropdownService.closeAll$.subscribe(() => {
      this.isOpen = false;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  toggle(event: Event): void {
    event.stopPropagation();
    if (this.isOpen) {
      this.isOpen = false;
    } else {
      this.dropdownService.closeAll();
      this.openMenu();
    }
  }

  private openMenu(): void {
    const button = this.elementRef.nativeElement.querySelector('.dropdown-toggle');
    const rect = button.getBoundingClientRect();
    this.menuTop = rect.bottom + window.scrollY ;
    this.menuLeft = rect.right - 120;
    this.isOpen = true;
  }


  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    if (this.isOpen && !this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  onEdit(): void {
    this.edit.emit(this.productId);
    this.isOpen = false;
  }

  onDelete(): void {
    this.delete.emit(this.productId);
    this.isOpen = false;
  }

}
