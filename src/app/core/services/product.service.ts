import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Product } from "../../shared/models/product.model";
import { environment } from "../../../environments/environments";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/bp/products`;

  constructor( private http: HttpClient ) {}

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>( this.apiUrl );
  }

  create( product: Omit<Product, 'id'> & { id: string } ): Observable<Product> {
    return this.http.post<Product>( this.apiUrl, product );
  }

  update( id: string, product: Partial<Product> ): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  verifyId(id: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/verification/${id}`);
  }


}
