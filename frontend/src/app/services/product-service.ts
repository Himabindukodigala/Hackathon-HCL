import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5000/api/products';

  products = signal<Product[]>([]);
  selectedProduct = signal<Product | null>(null);
  isLoading = signal(false);

  getProductsByCategory(categoryId: number): Observable<Product[]> {
    this.isLoading.set(true);
    return this.http.get<any>(`${this.apiUrl}?categoryId=${categoryId}&pageSize=100`).pipe(
      map(response => {
        const products = response.data || response;
        this.products.set(products);
        this.isLoading.set(false);
        return products;
      })
    );
  }

  getProductById(id: number): Observable<Product> {
    this.isLoading.set(true);
    return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(
      map(product => {
        this.selectedProduct.set(product);
        this.isLoading.set(false);
        return product;
      })
    );
  }

  getAllProducts(): Observable<Product[]> {
    this.isLoading.set(true);
    return this.http.get<any>(`${this.apiUrl}?pageSize=100`).pipe(
      map(response => {
        const products = response.data || response;
        this.products.set(products);
        this.isLoading.set(false);
        return products;
      })
    );
  }
}