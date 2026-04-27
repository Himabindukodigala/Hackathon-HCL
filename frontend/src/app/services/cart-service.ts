import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { CartSummary, AddToCartRequest, UpdateCartItemRequest } from '../models/cart.model';
import { ToastService } from './toast-service';


@Injectable({ providedIn: 'root' })
export class CartService {
  private http = inject(HttpClient);
  private toast = inject(ToastService);
  private apiUrl = 'http://localhost:5000/api/cart';

  private cartSignal = signal<CartSummary>({
    items: [],
    subTotal: 0,
    tax: 0,
    total: 0,
    itemCount: 0
  });

  cart = this.cartSignal.asReadonly();
  cartCount = computed(() => this.cartSignal().itemCount);
  cartTotal = computed(() => this.cartSignal().total);

  loadCart(): void {
    this.http.get<CartSummary>(this.apiUrl).subscribe({
      next: (cart) => this.cartSignal.set(cart),
      error: () => console.error('Failed to load cart')
    });
  }

  addToCart(productId: number, quantity: number = 1): Observable<CartSummary> {
    return this.http.post<CartSummary>(this.apiUrl, { productId, quantity } as AddToCartRequest).pipe(
      tap({
        next: (cart) => {
          this.cartSignal.set(cart);
          this.toast.show('Product added to cart!', 'success');
        },
        error: () => this.toast.show('Failed to add product to cart', 'danger')
      })
    );
  }

  updateQuantity(cartItemId: number, quantity: number): Observable<CartSummary> {
    return this.http.put<CartSummary>(`${this.apiUrl}/items/${cartItemId}`, { quantity } as UpdateCartItemRequest).pipe(
      tap({
        next: (cart) => this.cartSignal.set(cart),
        error: () => this.toast.show('Failed to update quantity', 'danger')
      })
    );
  }

  removeItem(cartItemId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/items/${cartItemId}`).pipe(
      tap({
        next: () => this.loadCart(),
        error: () => this.toast.show('Failed to remove item', 'danger')
      })
    );
  }

  clearCart(): Observable<void> {
    return this.http.delete<void>(this.apiUrl).pipe(
      tap({
        next: () => this.loadCart(),
        error: () => this.toast.show('Failed to clear cart', 'danger')
      })
    );
  }
}