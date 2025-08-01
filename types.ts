export interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  stripe_customer_id?: string;
  is_guest?: boolean;
  created_at: string;
  updated_at: string;
}

export interface GuestInfo {
  name: string;
  email: string;
  phone: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration_hours: number;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  service_id: string;
  start_time: string;
  end_time: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  total_amount: number;
  created_at: string;
  updated_at: string;
  service?: Service;
  user?: User;
}

export interface Payment {
  id: string;
  booking_id: string;
  stripe_payment_intent_id: string;
  amount: number;
  status: 'pending' | 'succeeded' | 'failed' | 'cancelled';
  created_at: string;
  updated_at: string;
  booking?: Booking;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  message?: string;
  created_at: string;
}

export interface BookingFormData {
  service_id: string;
  start_time: string;
  end_time: string;
  notes?: string;
  guestInfo?: GuestInfo;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface StripePaymentIntent {
  client_secret: string;
  amount: number;
} 