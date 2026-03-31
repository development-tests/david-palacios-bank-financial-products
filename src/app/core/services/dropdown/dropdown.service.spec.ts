import { TestBed } from '@angular/core/testing';
import { DropdownService } from './dropdown.service';

describe('DropdownService', () => {
  let service: DropdownService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DropdownService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit closeAll event when closeAll() is called', (done) => {
    service.closeAll$.subscribe(() => {
      done();
    });
    service.closeAll();
  });
});
