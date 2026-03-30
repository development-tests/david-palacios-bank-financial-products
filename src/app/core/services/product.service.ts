import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';

import { Product } from "../../shared/models/product.model";
import { environment } from "../../../environments/environments";

interface ApiResponse<T> {
  message?: string;
  data?: T;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/bp/products`;

  constructor( private http: HttpClient ) {}

  getAll(): Observable<Product[]> {
    return this.http.get< ApiResponse<Product[]> >( this.apiUrl ).pipe(
      map( response => response.data || [] )
    );
  }

  create( product: Product): Observable<Product> {
    return this.http.post< ApiResponse<Product> >( this.apiUrl, product ).pipe(
      map( response => response.data! )
    );
  }

  update( id: string, product: Partial<Product> ): Observable<Product> {
    return this.http.put< ApiResponse<Product> >(`${this.apiUrl}/${id}`, product).pipe(
      map( response => response.data! )
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete< ApiResponse<void> >(`${this.apiUrl}/${id}`).pipe(
      map( () => void 0 )
    );
  }

  verifyId(id: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/verification/${id}`);
  }


}
