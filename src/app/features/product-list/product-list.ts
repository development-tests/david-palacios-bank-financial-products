import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ProductService } from '../../core/services/product.service';
import { ToastService } from '../../core/services/toast.service';

import { Product } from '../../shared/models/product.model';
import { DropdownMenu } from '../../shared/components/dropdown-menu/dropdown-menu';
import { Pagination } from '../../shared/components/pagination/pagination';
import { ConfirmationModal } from '../../shared/components/confirmation-modal/confirmation-modal';


@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DropdownMenu,
    Pagination,
    ConfirmationModal
  ],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchTerm = '';
  pageSize = 5;
  pageSizes = [5, 10, 20];
  currentPage = 1;
  totalPages = 1;
  isLoading = true;
  deleteProductId: string | null = null;
  deleteProductTitle: string = '';

  constructor (
    private productService: ProductService,
    private router: Router,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;

    this.productService.getAll().subscribe({
      next: (data) => {
        this.products = data;
        this.applyFilters();
        this.isLoading = false;
      },
      error: () => {
        //? Error handled by interceptor
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    let filtered: Product[] = this.products;
    if ( this.searchTerm.trim() ) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter( p =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
      );
    }

    this.filteredProducts = filtered;
    this.totalPages = Math.ceil(this.filteredProducts.length / this.pageSize);
    this.currentPage = 1;
  }

  get paginatedProducts(): Product[] {
    const start = ( this.currentPage - 1 ) * this.pageSize;
    const end = start + this.pageSize;
    return this.filteredProducts.slice( start, end );
  }

  onSearch(): void {
    this.applyFilters();
  }

  onPageSizeChange(): void {
    this.applyFilters();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  addProduct(): void {
    this.router.navigate(['/product/new']);
  }

  editProduct(id: string): void {
    this.router.navigate(['/product/edit', id]);
  }

  confirmDelete(id: string, name: string): void {
    this.deleteProductId = id;
    this.deleteProductTitle = name;
  }

  deleteProduct(): void {
    if ( !this.deleteProductId ) return;
    this.productService.delete( this.deleteProductId ).subscribe({
      next: () => {
        this.toast.showSuccess('Product deleted successfully');
        this.loadProducts();
        this.deleteProductId = null;
      },
      error: () => {
        //? Error handled by interceptor
        this.deleteProductId = null;
      }
    });
  }

  cancelDelete(): void {
    this.deleteProductId = null;
  }

}
