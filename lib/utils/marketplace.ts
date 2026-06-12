/**
 * Client-friendly marketplace types and mock data.
 * Aligned with backend IProduct, IVendor, IOrder for easy API swap later.
 */

export type ProductCategory =
  | 'fashion'
  | 'food'
  | 'health-beauty'
  | 'accessories'
  | 'electronics'
  | 'books'
  | 'other';

export interface MarketplaceProduct {
  _id: string;
  name: string;
  slug: string;
  vendor: string;
  vendorName?: string;
  vendorSlug?: string;
  description?: string;
  category: ProductCategory;
  price: number;
  images: string[];
  inStock: boolean;
  stockQuantity: number;
  status: 'draft' | 'published' | 'archived';
  isFeatured: boolean;
  displayOrder: number;
}

export interface MarketplaceVendor {
  _id: string;
  name: string;
  slug: string;
  storeName: string;
  storeDescription?: string;
  logo?: string;
  coverImage?: string;
  status: string;
  isVerified: boolean;
  productCount?: number;
}

const CATEGORIES: { name: string; slug: ProductCategory; count: number }[] = [
  { name: 'Fashion', slug: 'fashion', count: 45 },
  { name: 'Food', slug: 'food', count: 32 },
  { name: 'Health & Beauty', slug: 'health-beauty', count: 28 },
  { name: 'Accessories', slug: 'accessories', count: 19 },
  { name: 'Electronics', slug: 'electronics', count: 12 },
  { name: 'Books', slug: 'books', count: 8 },
];

const MOCK_VENDORS: (MarketplaceVendor & { productCount: number })[] = [
  {
    _id: 'v1',
    name: 'Grace Fashion Co',
    slug: 'grace-fashion-co',
    storeName: 'Grace Fashion Co',
    storeDescription: 'Modest and stylish apparel for the whole family.',
    logo: '/images/album-1.jpg',
    status: 'active',
    isVerified: true,
    productCount: 15,
  },
  {
    _id: 'v2',
    name: 'Blessed Bites',
    slug: 'blessed-bites',
    storeName: 'Blessed Bites',
    storeDescription: 'Healthy snacks and organic food products.',
    logo: '/images/album-2.jpg',
    status: 'active',
    isVerified: true,
    productCount: 22,
  },
  {
    _id: 'v3',
    name: 'Radiant Beauty',
    slug: 'radiant-beauty',
    storeName: 'Radiant Beauty',
    storeDescription: 'Natural skincare and beauty from trusted sources.',
    logo: '/images/album-3.jpg',
    status: 'active',
    isVerified: false,
    productCount: 18,
  },
];

const MOCK_PRODUCTS: MarketplaceProduct[] = [
  {
    _id: 'p1',
    name: 'Wireless Studio Headphones',
    slug: 'wireless-studio-headphones',
    vendor: 'v1',
    vendorName: 'Grace Fashion Co',
    vendorSlug: 'grace-fashion-co',
    description: 'Premium sound quality for music and calls. Comfortable over-ear design.',
    category: 'electronics',
    price: 14999,
    images: ['/images/album-1.jpg'],
    inStock: true,
    stockQuantity: 20,
    status: 'published',
    isFeatured: true,
    displayOrder: 0,
  },
  {
    _id: 'p2',
    name: 'Custom Artist Hoodie',
    slug: 'custom-artist-hoodie',
    vendor: 'v1',
    vendorName: 'Grace Fashion Co',
    vendorSlug: 'grace-fashion-co',
    description: 'Soft cotton hoodie with unique designs. Unisex.',
    category: 'fashion',
    price: 5999,
    images: ['/images/album-2.jpg'],
    inStock: true,
    stockQuantity: 50,
    status: 'published',
    isFeatured: true,
    displayOrder: 1,
  },
  {
    _id: 'p3',
    name: 'Portable Bluetooth Speaker',
    slug: 'portable-bluetooth-speaker',
    vendor: 'v2',
    vendorName: 'Blessed Bites',
    vendorSlug: 'blessed-bites',
    description: 'Compact speaker with rich bass. Perfect for outdoor use.',
    category: 'electronics',
    price: 8999,
    images: ['/images/album-3.jpg'],
    inStock: true,
    stockQuantity: 30,
    status: 'published',
    isFeatured: false,
    displayOrder: 2,
  },
  {
    _id: 'p4',
    name: 'Organic Honey Jar',
    slug: 'organic-honey-jar',
    vendor: 'v2',
    vendorName: 'Blessed Bites',
    vendorSlug: 'blessed-bites',
    description: 'Pure organic honey, 500g. Sourced from local beekeepers.',
    category: 'food',
    price: 3499,
    images: ['/images/album-1.jpg'],
    inStock: true,
    stockQuantity: 100,
    status: 'published',
    isFeatured: true,
    displayOrder: 3,
  },
  {
    _id: 'p5',
    name: 'Natural Face Cream',
    slug: 'natural-face-cream',
    vendor: 'v3',
    vendorName: 'Radiant Beauty',
    vendorSlug: 'radiant-beauty',
    description: 'Gentle moisturizer with shea butter and vitamin E.',
    category: 'health-beauty',
    price: 4499,
    images: ['/images/album-2.jpg'],
    inStock: true,
    stockQuantity: 40,
    status: 'published',
    isFeatured: false,
    displayOrder: 4,
  },
  {
    _id: 'p6',
    name: 'Leather Cross Body Bag',
    slug: 'leather-cross-body-bag',
    vendor: 'v1',
    vendorName: 'Grace Fashion Co',
    vendorSlug: 'grace-fashion-co',
    description: 'Handcrafted leather bag. Multiple compartments.',
    category: 'accessories',
    price: 12999,
    images: ['/images/album-3.jpg'],
    inStock: true,
    stockQuantity: 15,
    status: 'published',
    isFeatured: true,
    displayOrder: 5,
  },
];

export function getMockCategories() {
  return CATEGORIES;
}

export function getMockVendors(): MarketplaceVendor[] {
  return MOCK_VENDORS.map(({ productCount, ...v }) => ({ ...v, productCount }));
}

export function getMockProducts(opts?: {
  category?: ProductCategory;
  featured?: boolean;
  limit?: number;
}): MarketplaceProduct[] {
  let list = MOCK_PRODUCTS.filter(p => p.status === 'published' && p.inStock);
  if (opts?.category) {
    list = list.filter(p => p.category === opts.category);
  }
  if (opts?.featured) {
    list = list.filter(p => p.isFeatured);
  }
  list.sort((a, b) => a.displayOrder - b.displayOrder);
  if (opts?.limit) {
    list = list.slice(0, opts.limit);
  }
  return list;
}

export function getMockProductBySlug(slug: string): MarketplaceProduct | null {
  return MOCK_PRODUCTS.find(p => p.slug === slug && p.status === 'published') ?? null;
}

export function getMockVendorBySlug(slug: string): MarketplaceVendor | null {
  const v = MOCK_VENDORS.find(v => v.slug === slug);
  return v ? { ...v, productCount: v.productCount } : null;
}

export function getMockProductsByVendorId(vendorId: string): MarketplaceProduct[] {
  return MOCK_PRODUCTS.filter(p => p.vendor === vendorId && p.status === 'published');
}

/** Format price for display (e.g. Naira) */
export function formatPrice(amount: number): string {
  return `₦${amount.toLocaleString()}`;
}

/** Resolve vendor WhatsApp from flat or populated product fields */
export function getProductVendorWhatsapp(product: {
  vendorWhatsapp?: string;
  vendorPopulated?: { whatsapp?: string };
}): string | undefined {
  return product.vendorWhatsapp ?? product.vendorPopulated?.whatsapp;
}

/** Build wa.me link from a WhatsApp number */
export function buildWhatsappLink(number: string): string {
  return `https://wa.me/${number.replace(/\D/g, '')}`;
}
