'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Store, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { SectionComp } from '@/components/general/SectionComp';

export interface MarketplaceProduct {
  _id: string;
  name: string;
  price: string;
  seller: string;
  image: string;
}

interface MarketplaceSectionProps {
  products: MarketplaceProduct[];
}

export const MarketplaceSection = ({ products }: MarketplaceSectionProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 280;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
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
        <Button variant="accent" size="sm" className="gap-2" asChild>
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
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
        {products.map((product, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className="max-w-[200px] sm:max-w-[240px] md:max-w-[280px] lg:max-w-[300px] xl:max-w-[320px] 2xl:max-w-[340px] snap-start shrink-0">
            <Link href={`/marketplace/products/${product._id}`} className="block">
              <motion.div
                whileHover={{ y: -4 }}
                className="group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <p className="text-xs text-muted-foreground mb-1">{product.seller}</p>
                  <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors mb-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary">{product.price}</span>
                    <Button variant="ghost" size="icon-sm">
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>
    </SectionComp>
  );
};
