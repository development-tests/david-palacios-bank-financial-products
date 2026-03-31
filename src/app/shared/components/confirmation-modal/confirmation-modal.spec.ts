import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationModal } from './confirmation-modal';

describe('ConfirmationModal', () => {
  let component: ConfirmationModal;
  let fixture: ComponentFixture<ConfirmationModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmationModal],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmationModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit confirm', () => {
    const emitSpy = jest.spyOn(component.confirm, 'emit');
    component.confirm.emit();
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should emit cancel', () => {
    const emitSpy = jest.spyOn(component.cancel, 'emit');
    component.cancel.emit();
    expect(emitSpy).toHaveBeenCalled();
  });
});
