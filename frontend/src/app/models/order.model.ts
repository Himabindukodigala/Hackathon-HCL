export interface PlaceOrderRequest {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  notes?: string;
}

export interface OrderResponse {
  id: number;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  totalAmount: number;
  status: string;
  placedAt: Date;
  items: OrderItemResponse[];
}

export interface OrderItemResponse {
  productId: number;
  productName: string;
  productImageUrl: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}