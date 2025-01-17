import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { IProduct } from '../../../shared/models/product.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly environment = environment;
  private readonly baseUrl = `${this.environment.apiUrl}/items`;

  constructor(private http: HttpClient) {}

  getProducts(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(this.baseUrl);
  }

  getProductById(id: number): Observable<IProduct> {
    return this.http.get<IProduct>(`${this.baseUrl}/${id}`);
  }

  createProduct(product: Partial<IProduct>): Observable<IProduct> {
    return this.http.post<IProduct>(this.baseUrl, product);
  }

  updateProduct(updates: Partial<IProduct>): Observable<IProduct> {
    delete updates.sku;
    return this.http.patch<IProduct>(`${this.baseUrl}/${updates.id}`, updates);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
