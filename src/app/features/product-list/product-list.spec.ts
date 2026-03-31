import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductList } from './product-list';
import { ProductService } from '../../core/services/product/product.service';
import { ToastService } from '../../core/services/toast/toast.service';
import { ChangeDetectorRef } from '@angular/core';
import { of, throwError } from 'rxjs';

describe('ProductList', () => {
  let component: ProductList;
  let fixture: ComponentFixture<ProductList>;
  let productServiceMock: any;
  let mockToast: any;

  beforeEach(async () => {
    productServiceMock = {
      getAll: jest.fn().mockReturnValue(of([])),
      delete: jest.fn().mockReturnValue(of(undefined)),
    };

    mockToast = { showSuccess: jest.fn(), showError: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [ProductList],
      providers: [
        { provide: ProductService, useValue: productServiceMock },
        { provide: ToastService, useValue: mockToast },
        { provide: ChangeDetectorRef, useValue: { detectChanges: jest.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', () => {
    expect(productServiceMock.getAll).toHaveBeenCalled();
  });

  it('should filter products by search term', () => {
    const mockProducts = [
      { id: '1', name: 'Tarjeta Oro', description: 'Descripción oro', logo: '', date_release: '', date_revision: '' },
      { id: '2', name: 'Cuenta Corriente', description: 'Descripción cuenta', logo: '', date_release: '', date_revision: '' },
    ];
    productServiceMock.getAll.mockReturnValue(of(mockProducts));
    component.loadProducts();
    component.searchTerm = 'oro';
    component.onSearch();
    expect(component.filteredProducts.length).toBe(1);
    expect(component.filteredProducts[0].name).toBe('Tarjeta Oro');
  });

  it('should change page size and reset pagination', () => {
    const mockProducts = Array(15).fill({
      id: '1',
      name: 'Test',
      description: '',
      logo: '',
      date_release: '',
      date_revision: ''
    });
    component.products = mockProducts;
    component.applyFilters();
    expect(component.totalPages).toBe(3);
    expect(component.currentPage).toBe(1);

    component.pageSize = 10;
    component.onPageSizeChange();
    expect(component.totalPages).toBe(2);
    expect(component.currentPage).toBe(1);
  });

  it('should change page when onPageChange is called', () => {
    component.onPageChange(2);
    expect(component.currentPage).toBe(2);
  });

  it('should open delete confirmation modal', () => {
    component.confirmDelete('123', 'Test Product');
    expect(component.deleteProductId).toBe('123');
    expect(component.deleteProductTitle).toBe('Test Product');
  });

  it('should cancel delete', () => {
    component.deleteProductId = '123';
    component.cancelDelete();
    expect(component.deleteProductId).toBeNull();
  });

  it('should call delete service and show success toast', () => {
    component.deleteProductId = '123';
    component.deleteProduct();
    expect(productServiceMock.delete).toHaveBeenCalledWith('123');
    expect(mockToast.showSuccess).toHaveBeenCalledWith('Product deleted successfully');
    expect(component.deleteProductId).toBeNull();
  });

  it('should handle error when loading products', () => {
    productServiceMock.getAll.mockReturnValue(throwError(() => new Error('Network error')));
    component.loadProducts();
    expect(component.isLoading).toBe(false);
  });

  it('should handle error when deleting product', () => {
    productServiceMock.delete.mockReturnValue(throwError(() => new Error('Delete failed')));
    component.deleteProductId = '123';
    component.deleteProduct();
    expect(component.deleteProductId).toBeNull();
  });
});
