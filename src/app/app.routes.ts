import { Routes } from '@angular/router';
import { ProductList } from './features/product-list/product-list';
import { ProductForm } from './features/product-form/product-form';

export const routes: Routes = [
  {
    path: '',
    component: ProductList
  },
  {
    path: 'product/new',
    component: ProductForm
  },
  {
    path: 'product/edit/:id',
    component: ProductForm
  },
  { path: '**', redirectTo: '' }
];
