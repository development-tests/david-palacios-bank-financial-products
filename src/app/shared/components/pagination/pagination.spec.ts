import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pagination } from './pagination';

describe('Pagination', () => {
  let component: Pagination;
  let fixture: ComponentFixture<Pagination>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pagination],
    }).compileComponents();

    fixture = TestBed.createComponent(Pagination);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit previous page when prev() called and currentPage > 1', () => {
    component.currentPage = 2;
    jest.spyOn(component.pageChange, 'emit');
    component.prev();
    expect(component.pageChange.emit).toHaveBeenCalledWith(1);
  });

  it('should not emit previous page when on first page', () => {
    component.currentPage = 1;
    jest.spyOn(component.pageChange, 'emit');
    component.prev();
    expect(component.pageChange.emit).not.toHaveBeenCalled();
  });

  it('should emit next page when next() called and currentPage < totalPages', () => {
    component.currentPage = 1;
    component.totalPages = 3;
    jest.spyOn(component.pageChange, 'emit');
    component.next();
    expect(component.pageChange.emit).toHaveBeenCalledWith(2);
  });

  it('should not emit next page when on last page', () => {
    component.currentPage = 3;
    component.totalPages = 3;
    jest.spyOn(component.pageChange, 'emit');
    component.next();
    expect(component.pageChange.emit).not.toHaveBeenCalled();
  });
});
