import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ProductService } from '../../core/services/product.service';
import { ToastService } from '../../core/services/toast.service';
import { urlValidator, futureOrTodayDateValidator, oneYearAfterValidator, uniqueIdValidator } from '../../shared/validators/custom-validators';


@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css',
})
export class ProductForm implements OnInit {
  productForm: FormGroup;
  isEdit = false;
  productId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastService
  ) {
    this.productForm = this.fb.group({
      id: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', [Validators.required, urlValidator]],
      date_release: ['', [Validators.required, futureOrTodayDateValidator]],
      date_revision: ['', Validators.required]
    }, { validators: oneYearAfterValidator });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.productId = id;
      this.loadProduct(id);
      this.productForm.get('id')?.disable();
    } else {
      this.productForm.get('id')?.setAsyncValidators(uniqueIdValidator(this.productService));
      this.productForm.get('id')?.updateValueAndValidity();
    }

    this.productForm.get('date_release')?.valueChanges.subscribe((releaseDate: string) => {
      if (releaseDate) {
        const revision = new Date(releaseDate);
        revision.setFullYear(revision.getFullYear() + 1);
        const revisionStr = revision.toISOString().split('T')[0];

        this.productForm.get('date_revision')?.setValue(revisionStr);
        this.productForm.updateValueAndValidity();
      }
    });
  }


  loadProduct(id: string): void {
    this.productService.getAll().subscribe({
      next: (products) => {
        const product = products.find(p => p.id === id);
        if (product) {
          this.productForm.patchValue({
            id: product.id,
            name: product.name,
            description: product.description,
            logo: product.logo,
            date_release: product.date_release,
            date_revision: product.date_revision
          });
        } else {
          this.toast.showError('Product not found');
          this.router.navigate(['/']);
        }
      },
      error: () => this.router.navigate(['/'])
    });
  }


  onSubmit(): void {
    if (this.productForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    const formValue = this.productForm.getRawValue();
    if (this.isEdit && this.productId) {
      this.productService.update(this.productId, formValue).subscribe({
        next: () => {
          this.toast.showSuccess('Product updated successfully');
          this.router.navigate(['/']);
        }
      });
    } else {
      this.productService.create(formValue).subscribe({
        next: () => {
          this.toast.showSuccess('Product created successfully');
          this.router.navigate(['/']);
        }
      });
    }
  }


resetForm(): void {
  if (this.isEdit) {
    this.loadProduct(this.productId!);
  } else {
    this.productForm.reset();

    this.productForm.get('id')?.setAsyncValidators(uniqueIdValidator(this.productService));
    this.productForm.get('id')?.updateValueAndValidity();

    this.productForm.updateValueAndValidity();
  }
}


  isFieldInvalid(fieldName: string): boolean {
    const control = this.productForm.get(fieldName);
    return !!control && control.invalid && (control.touched || control.dirty);
  }

  private markAllAsTouched(): void {
    Object.values(this.productForm.controls).forEach(control => {
      control.markAsTouched();
    });
    this.productForm.updateValueAndValidity();
  }

  goBack(): void {
    this.router.navigate(['/']);
  }


}
