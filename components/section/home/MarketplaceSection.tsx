'use client';

import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { SectionComp } from '@/components/general/SectionComp';
import { SectionEmptyState } from '@/components/general/SectionEmptyState';
import { FillImage } from '@/components/general/FillImage';
import { MarketplaceVendorChatButton } from '@/components/section/marketplace/MarketplaceVendorChatButton';
import { VendorProductWhatsAppModal } from '@/components/section/marketplace/VendorProductWhatsAppModal';

export interface MarketplaceProduct {
  _id: string;
  slug: string;
  name: string;
  price: string;
  priceAmount: number;
  seller: string;
  image: string;
  vendorWhatsapp?: string;
}

interface MarketplaceSectionProps {
  products: MarketplaceProduct[];
}

export const MarketplaceSection = ({ products }: MarketplaceSectionProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [whatsappOpen, setWhatsappOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState<MarketplaceProduct | null>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 280;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const productPageUrl = (slug: string) =>
    typeof window !== 'undefined'
      ? `${window.location.origin}/marketplace/products/${slug}`
      : `/marketplace/products/${slug}`;

  const openChat = (product: MarketplaceProduct) => {
    setActiveProduct(product);
    setWhatsappOpen(true);
  };

  return (
    <>
      <SectionComp
        id="marketplace"
        icon={ShoppingBag}
        iconColor="accent"
        heading="Marketplace"
        subtext="Shop from creative vendors"
        viewAllLink="/marketplace"
        showPrevNext={true}
        onPrev={() => scroll('left')}
        onNext={() => scroll('right')}
        extraButtons={
          <Button variant="accent" size="default" className="gap-2 min-h-11" asChild>
            <Link href="/marketplace/become-vendor">
              <Store className="w-4 h-4" />
              Become a Vendor
            </Link>
          </Button>
        }
        contentProps={{
          className: '',
          enableAnimation: false,
        }}>
        {products.length === 0 ? (
          <SectionEmptyState
            title="No marketplace products yet"
            description="New items will appear here when vendors list them. Check back soon."
            icon={ShoppingBag}
            actionLabel="Browse marketplace"
            actionHref="/marketplace"
          />
        ) : (
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
            {products.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="w-[200px] sm:w-[240px] md:w-[280px] lg:w-[300px] xl:w-[320px] 2xl:w-[340px] snap-start shrink-0">
                <Link href={`/marketplace/products/${product.slug}`} className="block">
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all">
                    <div className="relative aspect-square overflow-hidden">
                      <FillImage
                        src={product.image ?? ''}
                        alt={product.name}
                        imageContext="public"
                        sizes="(max-width: 768px) 50vw, 280px"
                        className="transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-muted-foreground mb-1">{product.seller}</p>
                      <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors mb-2">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-primary">{product.price}</span>
                        <MarketplaceVendorChatButton
                          vendorWhatsapp={product.vendorWhatsapp}
                          variant="ghost"
                          size="icon-sm"
                          iconOnly
                          stopPropagation
                          onChatClick={() => openChat(product)}
                          aria-label={`Chat with ${product.seller}`}
                        />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </SectionComp>

      {activeProduct && (
        <VendorProductWhatsAppModal
          open={whatsappOpen}
          onOpenChange={setWhatsappOpen}
          vendorWhatsapp={activeProduct.vendorWhatsapp}
          inquiry={{
            productName: activeProduct.name,
            price: activeProduct.priceAmount,
            vendorName: activeProduct.seller,
            pageUrl: productPageUrl(activeProduct.slug),
          }}
        />
      )}
    </>
  );
};
