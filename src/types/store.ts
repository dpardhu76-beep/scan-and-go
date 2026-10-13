export type LanguageCode =
  | 'te' // Telugu (Vijayawada / Andhra Pradesh)
  | 'hi' // Hindi
  | 'en' // English (India)
  | 'ta' // Tamil
  | 'ml' // Malayalam
  | 'kn' // Kannada
  | 'bn' // Bengali
  | 'mr' // Marathi
  | 'gu'; // Gujarati

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  memberTier: string;
  walletBalance: number;
  walletPoints: number;
  createdAt: string;
}

export interface StoreLocation {
  id: string;
  name: string;
  chain:
    | 'DMart'
    | 'Reliance Smart'
    | 'More Supermarket'
    | 'Vishal Mega Mart'
    | 'Usha Udaya'
    | 'Spencers'
    | 'Ratna'
    | 'Ratnadeep'
    | 'Heritage Fresh'
    | 'Kalyan Supermarket'
    | 'Metro Wholesale'
    | 'Fresh Choice'
    | string;
  address: string;
  area: string;
  city: string;
  pincode: string;
  distance: string;
  openHours: string;
  aisleCount: number;
  cartCapacity: string;
  badge?: string;
  dealHighlight: string;
  landmark: string;
}

export interface ProductItem {
  id: string;
  barcode: string;
  name: string;
  teluguName?: string;
  brand: string;
  price: number; // in INR (₹)
  originalPrice?: number;
  weightKg: number;
  category:
    | 'Fruits & Vegetables'
    | 'Dairy & Sweets'
    | 'Staples & Groceries'
    | 'Bakery & Snacks'
    | 'Beverages'
    | 'Stationery'
    | 'Electronics & Home';
  aisle: string;
  image: string;
  unit: string;
  dietary?: string[];
  rating: number;
  reviewsCount: number;
  isWeighable?: boolean;
  pricePerKg?: number;
  assured?: boolean;
  assuranceBadge?: string;
  description: string;
}

export interface CartItem {
  product: ProductItem;
  quantity: number;
  measuredWeightKg: number;
  addedAt: Date;
}

export interface Receipt {
  orderId: string;
  date: string;
  storeName: string;
  storeAddress: string;
  pincode: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  cgst: number;
  sgst: number;
  total: number;
  savings: number;
  paymentMethod: string;
  mobileNumber: string;
  upiRefNumber: string;
  gatePassQr: string;
  securityStatus: 'CLEAR' | 'RANDOM_CHECK_PASSED';
  membershipTier: string;
  pointsEarned: number;
}

export interface ShoppingListItem {
  id: string;
  name: string;
  category?: string;
  checked: boolean;
}

export interface Translations {
  scanShopPayGo: string;
  smartCheckout: string;
  selectLanguage: string;
  selectLanguageDesc: string;
  selectStore: string;
  selectStoreDesc: string;
  startShopping: string;
  cart: string;
  emptyCart: string;
  emptyCartSub: string;
  subtotal: string;
  savings: string;
  tax: string;
  total: string;
  checkout: string;
  scanBarcode: string;
  weighProduce: string;
  shoppingList: string;
  receipts: string;
  cameraScanner: string;
  testBarcodes: string;
  enterBarcodeManually: string;
  typeBarcode: string;
  addCode: string;
  weightVerification: string;
  weightVerified: string;
  itemsInCart: string;
  payNow: string;
  receiptTitle: string;
  gatePassTitle: string;
  scanGatePrompt: string;
  openTurnstile: string;
  gateUnlocked: string;
  couponPlaceholder: string;
  applyCoupon: string;
  pointsEarned: string;
  aisle: string;
  allCategories: string;
  quickAdd: string;
  sendToMobile: string;
  mobilePlaceholder: string;
  payWithUpi: string;
}
