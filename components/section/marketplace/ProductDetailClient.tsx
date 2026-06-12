'use client';

import { useMemo, useState } from 'react';
import { SectionContainer } from '@/components/general/SectionContainer';
import { Button } from '@/components/ui/button';
import { MessageCircle, ShoppingCart, Store, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import type { MarketplaceProduct } from '@/lib/utils/marketplace';
import { formatPrice, getProductVendorWhatsapp } from '@/lib/utils/marketplace';
import { VendorProductWhatsAppModal } from '@/components/section/marketplace/VendorProductWhatsAppModal';
import { useCartStore } from '@/lib/store/cartStore';
import { MultilineText } from '@/components/general/MultilineText';
import {
  getProductCategoryName,
  getProductCategorySlug,
  type IMarketplaceProduct,
  type IMarketplaceProductVariant,
} from '@/lib/constants/endpoints';
import { ProductCard } from '@/components/section/marketplace/ProductCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { FillImage } from '@/components/general/FillImage';

export interface ProductDetailClientProps {
  product: (MarketplaceProduct | IMarketplaceProduct) | null;
  relatedProducts?: IMarketplaceProduct[];
}

export function ProductDetailClient({ product, relatedProducts = [] }: ProductDetailClientProps) {
  if (!product) {
    return (
      <>
        <SectionContainer className="marketplace-page-top">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Product not found</h1>
            <Button asChild variant="outline">
              <Link href="/marketplace/products">Back to products</Link>
            </Button>
          </div>
        </SectionContainer>
      </>
    );
  }

  return (
    <ProductDetailContent
      product={product as IMarketplaceProduct}
      relatedProducts={relatedProducts}
    />
  );
}

interface ProductDetailContentProps {
  product: IMarketplaceProduct;
  relatedProducts: IMarketplaceProduct[];
}

function ProductDetailContent({ product, relatedProducts }: ProductDetailContentProps) {
  const { items, actions } = useCartStore();
  const categoryLabel = getProductCategoryName(product);
  const categorySlug = getProductCategorySlug(product);
  const images = (product.images as string[] | undefined) ?? product.images ?? [];

  const variants = useMemo<IMarketplaceProductVariant[]>(
    () => (product.variants as IMarketplaceProductVariant[] | undefined) ?? [],
    [product.variants]
  );
  const variationOptions = useMemo(
    () => product.variationOptions ?? [],
    [product.variationOptions]
  );

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    if (variants.length === 0 || variationOptions.length === 0) return {};
    const defaultVariant =
      variants.find(v => v.isDefault) ??
      variants.find(v => v.inStock) ??
      (variants.length > 0 ? variants[0] : undefined);
    if (!defaultVariant) return {};
    return { ...defaultVariant.options };
  });

  const [whatsappOpen, setWhatsappOpen] = useState(false);

  const selectedVariant = useMemo<IMarketplaceProductVariant | undefined>(() => {
    if (variants.length === 0 || variationOptions.length === 0) return undefined;
    const keys = Object.keys(selectedOptions);
    if (keys.length === 0) {
      return variants.find(v => v.isDefault) ?? variants[0];
    }
    return variants.find(variant =>
      variationOptions.every(opt => {
        const selected = selectedOptions[opt.name];
        return selected && variant.options[opt.name] === selected;
      })
    );
  }, [selectedOptions, variants, variationOptions]);

  const effectivePrice = selectedVariant?.price ?? product.price;
  const isOutOfStock =
    variants.length > 0 ? !selectedVariant || !selectedVariant.inStock : product.inStock === false;
  const inCart = items.some(
    i => i.productId === product._id && (i.sku ?? '') === (selectedVariant?.sku ?? '')
  );

  const handleOptionChange = (name: string, value: string) => {
    setSelectedOptions(prev => ({ ...prev, [name]: value }));
  };

  const handleAddToCart = () => {
    const sku = selectedVariant?.sku;
    const price = selectedVariant?.price ?? product.price;
    const vendorWhatsapp = getProductVendorWhatsapp(product);
    actions.addItem({
      productId: product._id,
      slug: product.slug,
      name: product.name,
      image: (selectedVariant?.image || product.images?.[0] || '') as string,
      price,
      quantity: 1,
      sku,
      vendorName: product.vendorName,
      vendorSlug: product.vendorSlug,
      vendorWhatsapp,
    });
  };

  const vendorWhatsapp = getProductVendorWhatsapp(product);

  const variantLabel =
    selectedVariant && Object.keys(selectedVariant.options).length > 0
      ? Object.entries(selectedVariant.options)
          .map(([key, value]) => `${key}: ${value}`)
          .join(' • ')
      : undefined;

  const productPageUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/marketplace/products/${product.slug}`
      : `/marketplace/products/${product.slug}`;

  return (
    <>
      <SectionContainer className="marketplace-page-top">
        <div className="max-w-7xl mx-auto">
          <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
            <Link href="/marketplace" className="hover:text-primary">
              Marketplace
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/marketplace/products" className="hover:text-primary">
              Products
            </Link>
            {categoryLabel && categoryLabel !== 'Other' && (
              <>
                <ChevronRight className="w-4 h-4" />
                <Link
                  href={`/marketplace/products?category=${categorySlug}`}
                  className="hover:text-primary">
                  {categoryLabel}
                </Link>
              </>
            )}
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground line-clamp-1">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-muted rounded-xl overflow-hidden">
              {images.length > 0 ? (
                <Swiper spaceBetween={16} slidesPerView={1} className="w-full h-full max-h-[480px]">
                  {images.map(src => (
                    <SwiperSlide key={src}>
                      <div className="relative aspect-square w-full h-full bg-muted">
                        <FillImage
                          src={src}
                          alt={product.name}
                          imageContext="public"
                          sizes="(max-width: 768px) 100vw, 600px"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <div className="relative aspect-square w-full h-full bg-muted">
                  <FillImage
                    src=""
                    alt={product.name}
                    imageContext="public"
                    sizes="(max-width: 768px) 100vw, 600px"
                  />
                </div>
              )}
            </div>

            <div>
              {product.vendorName && (
                <Link
                  href={`/marketplace/vendors/${product.vendorSlug ?? product.vendor}`}
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-2">
                  <Store className="w-4 h-4" />
                  {product.vendorName}
                </Link>
              )}
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {product.name}
              </h1>
              <p className="text-2xl font-bold text-primary mb-2">{formatPrice(effectivePrice)}</p>
              {isOutOfStock && (
                <p className="text-sm font-medium text-destructive mb-4">Out of stock</p>
              )}
              {product.description && (
                <MultilineText
                  text={product.description}
                  className="mb-8"
                  paragraphClassName="text-muted-foreground"
                />
              )}

              {variationOptions.length > 0 && (
                <div className="mb-8 space-y-4">
                  <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                    Choose options
                  </h2>
                  <div className="space-y-4">
                    {variationOptions.map(opt => (
                      <div key={opt.name} className="text-sm">
                        <p className="mb-2 font-medium text-foreground">{opt.name}</p>
                        <div className="flex flex-wrap gap-2">
                          {opt.values.map((value, valueIdx) => {
                            const active = selectedOptions[opt.name] === value;
                            return (
                              <button
                                key={`${opt.name}-${valueIdx}-${value}`}
                                type="button"
                                onClick={() => handleOptionChange(opt.name, value)}
                                className={`px-3 py-1 rounded-full border text-xs md:text-sm transition-colors ${
                                  active
                                    ? 'bg-primary text-primary-foreground border-primary'
                                    : 'bg-background text-foreground border-border hover:bg-muted'
                                }`}>
                                {value}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                  {variants.length > 0 && (
                    <div className="mt-3 rounded-lg border border-border bg-background/40 p-3 space-y-1 text-xs md:text-sm">
                      {variants.map(variant => {
                        const label = Object.entries(variant.options)
                          .map(([k, v]) => `${k}: ${v}`)
                          .join(' • ');
                        const isCurrent =
                          selectedVariant &&
                          Object.keys(variant.options).every(
                            key => selectedVariant.options[key] === variant.options[key]
                          );
                        return (
                          <div
                            key={variant.sku || label}
                            className={`flex flex-wrap items-center justify-between gap-2 ${
                              isCurrent ? 'bg-primary/5 rounded-md px-2 py-1' : ''
                            }`}>
                            <div className="text-foreground">{label}</div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-primary">
                                {formatPrice(variant.price)}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                                  variant.inStock
                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200'
                                    : 'bg-destructive/10 text-destructive'
                                }`}>
                                {variant.inStock ? 'In stock' : 'Out of stock'}
                              </span>
                              {variant.isDefault && (
                                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-muted text-muted-foreground">
                                  Default
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={handleAddToCart}
                  className="gap-2 bg-primary hover:bg-primary/90 disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={isOutOfStock}>
                  <ShoppingCart className="w-4 h-4" />
                  {isOutOfStock ? 'Out of stock' : inCart ? 'In cart' : 'Add to cart'}
                </Button>
                {vendorWhatsapp ? (
                  <Button variant="outline" className="gap-2" onClick={() => setWhatsappOpen(true)}>
                    <MessageCircle className="w-4 h-4" />
                    Chat with vendor
                  </Button>
                ) : (
                  product.vendorSlug && (
                    <Button variant="outline" className="gap-2" asChild>
                      <Link href={`/marketplace/vendors/${product.vendorSlug}`}>
                        <MessageCircle className="w-4 h-4" />
                        Chat with vendor
                      </Link>
                    </Button>
                  )
                )}
              </div>
              <VendorProductWhatsAppModal
                open={whatsappOpen}
                onOpenChange={setWhatsappOpen}
                vendorWhatsapp={vendorWhatsapp}
                vendorSlug={product.vendorSlug}
                inquiry={{
                  productName: product.name,
                  price: effectivePrice,
                  vendorName: product.vendorName,
                  pageUrl: productPageUrl,
                  variantLabel,
                  sku: selectedVariant?.sku ?? product.sku,
                }}
              />
              {!product.inStock && (
                <p className="mt-4 text-destructive font-medium">Out of stock</p>
              )}
            </div>
          </div>
        </div>
      </SectionContainer>

      {relatedProducts.length > 0 ? (
        <SectionContainer className="pb-16">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-6">Related products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(related => (
                <ProductCard key={related._id} product={related} showChat={false} />
              ))}
            </div>
          </div>
        </SectionContainer>
      ) : null}
    </>
  );
}
