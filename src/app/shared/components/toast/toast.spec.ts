import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Toast } from './toast';
import { ToastService } from '../../../core/services/toast/toast.service';
import { of } from 'rxjs';

describe('Toast', () => {
  let component: Toast;
  let fixture: ComponentFixture<Toast>;
  let mockToastService: { toast$: any; clear: jest.Mock };

  beforeEach(async () => {
    mockToastService = {
      toast$: of({ type: 'success', text: 'Hello' }),
      clear: jest.fn(),
    };
    await TestBed.configureTestingModule({
      imports: [Toast],
      providers: [{ provide: ToastService, useValue: mockToastService }],
    }).compileComponents();

    fixture = TestBed.createComponent(Toast);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call clear on close', () => {
    component.close();
    expect(mockToastService.clear).toHaveBeenCalled();
  });
});
