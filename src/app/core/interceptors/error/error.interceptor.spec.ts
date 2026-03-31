import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { errorInterceptor } from './error.interceptor';
import { ToastService } from '../../services/toast/toast.service';

describe('errorInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let mockToastService: Partial<ToastService>;

  beforeEach(() => {
    mockToastService = {
      showError: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
        { provide: ToastService, useValue: mockToastService },
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should show error message on HTTP 500', () => {
    httpClient.get('/test').subscribe({
      error: () => {},
    });

    const req = httpMock.expectOne('/test');
    req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });

    expect(mockToastService.showError).toHaveBeenCalledWith('Ocurrió un error inesperado');
  });

  it('should show custom error message from backend', () => {
    httpClient.get('/test').subscribe({
      error: () => {},
    });

    const req = httpMock.expectOne('/test');
    req.flush({ message: 'ID duplicado' }, { status: 400, statusText: 'Bad Request' });

    expect(mockToastService.showError).toHaveBeenCalledWith('ID duplicado');
  });

  it('should show error message from error.message if no backend message', () => {
    httpClient.get('/test').subscribe({
      error: () => {},
    });

    const req = httpMock.expectOne('/test');
    req.error(new ErrorEvent('Network error', { message: 'Connection refused' }));

    expect(mockToastService.showError).toHaveBeenCalledWith('Connection refused');
  });

  it('should show generic error message for unknown error without message', () => {
    httpClient.get('/test').subscribe({ error: () => {} });
    const req = httpMock.expectOne('/test');

    req.flush('', { status: 500, statusText: 'Internal Server Error' });
    expect(mockToastService.showError).toHaveBeenCalledWith('Ocurrió un error inesperado');
  });


  it('should fallback to error.message for HTTP error without custom message', () => {
    httpClient.get('/test').subscribe({ error: () => {} });
    const req = httpMock.expectOne('/test');
    req.flush('Some error', { status: 400, statusText: 'Bad Request' });
    expect(mockToastService.showError).toHaveBeenCalledWith('Http failure response for /test: 400 Bad Request');
  });

});
