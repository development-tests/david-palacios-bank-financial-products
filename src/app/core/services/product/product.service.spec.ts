import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { Product } from '../../../shared/models/product.model';
import { environment } from '../../../../environments/environments';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/bp/products`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService],
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all products (GET)', () => {
    const mockResponse = { data: [{ id: '1', name: 'Test', description: '', logo: '', date_release: '', date_revision: '' }] };
    service.getAll().subscribe(products => {
      expect(products).toEqual(mockResponse.data);
    });
    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should create a product (POST)', () => {
    const newProduct: Product = { id: '2', name: 'New', description: 'desc', logo: 'logo.png', date_release: '2025-01-01', date_revision: '2026-01-01' };
    service.create(newProduct).subscribe(product => {
      expect(product).toEqual(newProduct);
    });
    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newProduct);
    req.flush({ data: newProduct });
  });

  it('should update a product (PUT)', () => {
    const update = { name: 'Updated' };
    service.update('1', update).subscribe(product => {
      expect(product).toEqual(update);
    });
    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush({ data: update });
  });

  it('should delete a product (DELETE)', () => {
    service.delete('1').subscribe(() => {});
    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should verify ID existence (GET)', () => {
    service.verifyId('1').subscribe(exists => {
      expect(exists).toBe(true);
    });
    const req = httpMock.expectOne(`${apiUrl}/verification/1`);
    expect(req.request.method).toBe('GET');
    req.flush(true);
  });
});
