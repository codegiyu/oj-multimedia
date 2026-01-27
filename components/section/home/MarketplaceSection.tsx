'use client';

import { motion } from 'framer-motion';
import { ShoppingBag, ArrowRight, Store, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export interface MarketplaceProduct {
  name: string;
  price: string;
  seller: string;
  image: string;
}

interface MarketplaceSectionProps {
  products: MarketplaceProduct[];
}

export const MarketplaceSection = ({ products }: MarketplaceSectionProps) => {
  return (
    <section id="marketplace" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <h2 className="section-header">Marketplace</h2>
              <p className="text-muted-foreground text-sm">Shop from creative vendors</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="accent" size="sm" className="gap-2" asChild>
              <Link href="/marketplace/become-vendor">
                <Store className="w-4 h-4" />
                Become a Vendor
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="gap-2 text-muted-foreground hover:text-primary"
              asChild>
              <Link href="/marketplace">
                View All
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Products Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, index) => (
            <motion.div
              key={index}
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
          ))}
        </motion.div>
      </div>
    </section>
  );
};
