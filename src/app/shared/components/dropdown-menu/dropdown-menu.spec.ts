import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DropdownMenu } from './dropdown-menu';
import { DropdownService } from '../../../core/services/dropdown/dropdown.service';
import { of } from 'rxjs';

describe('DropdownMenu', () => {
  let component: DropdownMenu;
  let fixture: ComponentFixture<DropdownMenu>;
  let mockDropdownService: Partial<DropdownService>;

  beforeEach(async () => {
    mockDropdownService = {
      closeAll: jest.fn(),
      closeAll$: of(undefined),
    };

    await TestBed.configureTestingModule({
      imports: [DropdownMenu],
      providers: [
        { provide: DropdownService, useValue: mockDropdownService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DropdownMenu);
    component = fixture.componentInstance;
    component.productId = '123';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle dropdown', () => {
    component.toggle(new Event('click'));
    expect(component.isOpen).toBe(true);
    component.toggle(new Event('click'));
    expect(component.isOpen).toBe(false);
  });

  it('should emit edit event', () => {
    const emitSpy = jest.spyOn(component.edit, 'emit');
    component.onEdit();
    expect(emitSpy).toHaveBeenCalledWith('123');
    expect(component.isOpen).toBe(false);
  });

  it('should emit delete event', () => {
    const emitSpy = jest.spyOn(component.delete, 'emit');
    component.onDelete();
    expect(emitSpy).toHaveBeenCalledWith('123');
    expect(component.isOpen).toBe(false);
  });

  it('should close dropdown when clicking outside', () => {
    component.toggle(new Event('click'));
    expect(component.isOpen).toBe(true);
    const outsideClick = new Event('click');

    document.dispatchEvent(outsideClick);
    expect(component.isOpen).toBe(false);
  });

});
