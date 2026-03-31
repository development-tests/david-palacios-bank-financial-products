import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ProductForm } from './product-form';
import { ProductService } from '../../core/services/product/product.service';
import { ToastService } from '../../core/services/toast/toast.service';

describe('ProductForm', () => {
  let component: ProductForm;
  let fixture: ComponentFixture<ProductForm>;
  let mockProductService: jest.Mocked<ProductService>;
  let mockRouter: jest.Mocked<Router>;
  let mockActivatedRoute: any;
  let mockToast: jest.Mocked<ToastService>;

  const getFutureDates = () => {
    const today = new Date();
    const futureYear = today.getFullYear() + 1;
    const releaseDate = `${futureYear}-01-01`;
    const revisionDate = `${futureYear + 1}-01-01`;
    return { releaseDate, revisionDate };
  };

  beforeEach(async () => {
    mockProductService = {
      getAll: jest.fn().mockReturnValue(of([])),
      create: jest.fn().mockReturnValue(of({})),
      update: jest.fn().mockReturnValue(of({})),
      verifyId: jest.fn().mockReturnValue(of(false)),
    } as any;
    mockRouter = { navigate: jest.fn() } as any;
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jest.fn().mockReturnValue(null),
        },
      },
    };
    mockToast = { showSuccess: jest.fn(), showError: jest.fn(), showInfo: jest.fn(), clear: jest.fn() } as any;

    await TestBed.configureTestingModule({
      imports: [ProductForm, ReactiveFormsModule],
      providers: [
        { provide: ProductService, useValue: mockProductService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: ToastService, useValue: mockToast },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should mark fields as invalid when empty', () => {
    const form = component.productForm;
    expect(form.valid).toBe(false);
    expect(form.get('id')?.hasError('required')).toBe(true);
    expect(form.get('name')?.hasError('required')).toBe(true);
  });

  it('should call create service on valid submit (new product)', () => {
    component.isEdit = false;
    const { releaseDate, revisionDate } = getFutureDates();
    component.productForm.setValue({
      id: 'new123',
      name: 'Valid Name',
      description: 'Valid description',
      logo: 'https://example.com/logo.png',
      date_release: releaseDate,
      date_revision: revisionDate,
    });
    component.onSubmit();
    expect(mockProductService.create).toHaveBeenCalled();
    expect(mockToast.showSuccess).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should reset form correctly', () => {
    component.resetForm();
    expect(component.productForm.pristine).toBe(true);
  });

  it('should enter edit mode when route has id parameter', () => {
    mockActivatedRoute.snapshot.paramMap.get.mockReturnValue('existing-id');
    const { releaseDate, revisionDate } = getFutureDates();
    mockProductService.getAll.mockReturnValue(of([{
      id: 'existing-id', name: 'Existing', description: 'desc', logo: 'logo.png',
      date_release: releaseDate, date_revision: revisionDate
    }]));
    const newFixture = TestBed.createComponent(ProductForm);
    const newComponent = newFixture.componentInstance;
    newFixture.detectChanges();
    expect(newComponent.isEdit).toBe(true);
    expect(newComponent.productId).toBe('existing-id');
    expect(newComponent.productForm.get('id')?.disabled).toBe(true);
  });

  it('should show error if product not found when loading for edit', () => {
    mockActivatedRoute.snapshot.paramMap.get.mockReturnValue('non-existent');
    mockProductService.getAll.mockReturnValue(of([]));
    const newFixture = TestBed.createComponent(ProductForm);
    newFixture.detectChanges();
    expect(mockToast.showError).toHaveBeenCalledWith('Product not found');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should call update service on valid submit in edit mode', async () => {
    mockActivatedRoute.snapshot.paramMap.get.mockReturnValue('existing-id');
    const { releaseDate, revisionDate } = getFutureDates();
    const existingProduct = {
      id: 'existing-id',
      name: 'Existing',
      description: 'desc',
      logo: 'https://example.com/logo.png',
      date_release: releaseDate,
      date_revision: revisionDate,
    };
    mockProductService.getAll.mockReturnValue(of([existingProduct]));

    const newFixture = TestBed.createComponent(ProductForm);
    const newComponent = newFixture.componentInstance;
    newFixture.detectChanges();
    await newFixture.whenStable();

    newComponent.productForm.get('name')?.setValue('Updated Name');
    newComponent.onSubmit();

    expect(mockProductService.update).toHaveBeenCalledWith(
      'existing-id',
      expect.objectContaining({ name: 'Updated Name' })
    );
    expect(mockToast.showSuccess).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should not submit if form is invalid', () => {
    component.productForm.get('name')?.setValue('');
    component.onSubmit();
    expect(mockProductService.create).not.toHaveBeenCalled();
    expect(mockProductService.update).not.toHaveBeenCalled();
  });

  it('should reset form correctly in edit mode', () => {
    component.isEdit = true;
    component.productId = 'existing-id';
    const loadSpy = jest.spyOn(component, 'loadProduct');
    component.resetForm();
    expect(loadSpy).toHaveBeenCalledWith('existing-id');
  });

  it('should handle error when loading product fails', () => {
    mockActivatedRoute.snapshot.paramMap.get.mockReturnValue('existing-id');
    mockProductService.getAll.mockReturnValue(throwError(() => new Error('Load error')));
    const newFixture = TestBed.createComponent(ProductForm);
    newFixture.detectChanges();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should handle error when create fails', () => {
    mockProductService.create.mockReturnValue(throwError(() => new Error('Create error')));
    component.isEdit = false;
    const { releaseDate, revisionDate } = getFutureDates();
    component.productForm.setValue({
      id: 'new123',
      name: 'Valid Name',
      description: 'Valid description',
      logo: 'https://example.com/logo.png',
      date_release: releaseDate,
      date_revision: revisionDate,
    });
    component.onSubmit();
    expect(mockProductService.create).toHaveBeenCalled();
    expect(mockToast.showError).toHaveBeenCalledWith('Error creating product');
  });

  it('should handle error when update fails', async () => {
    mockProductService.update.mockReturnValue(throwError(() => new Error('Update error')));
    component.isEdit = true;
    component.productId = 'existing-id';
    const { releaseDate, revisionDate } = getFutureDates();
    component.productForm.setValue({
      id: 'existing-id',
      name: 'Valid Name',
      description: 'Valid description',
      logo: 'https://example.com/logo.png',
      date_release: releaseDate,
      date_revision: revisionDate,
    });
    component.productForm.updateValueAndValidity();
    await fixture.whenStable();
    component.onSubmit();
    expect(mockProductService.update).toHaveBeenCalled();
    expect(mockToast.showError).toHaveBeenCalledWith('Error updating product');
  });
});
