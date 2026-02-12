'use client';

import { motion } from 'framer-motion';
import { ShoppingBag, ExternalLink, Book, Laptop } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SectionComp } from '@/components/general/SectionComp';
import type { AffiliateProduct } from './ResourcesPageClient';

interface AffiliateProductsProps {
  products: AffiliateProduct[];
}

const iconMap: Record<string, typeof Book> = {
  Books: Book,
  Gadgets: Laptop,
  Equipment: ShoppingBag,
  Apparel: ShoppingBag,
};

export const AffiliateProducts = ({ products }: AffiliateProductsProps) => {
  return (
    <SectionComp
      id="affiliate-products"
      icon={ShoppingBag}
      iconColor="secondary"
      heading="Affiliate Products"
      subtext="Recommended books, gadgets, and resources to support your faith journey"
      contentProps={{ enableAnimation: false }}>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product, index) => {
          const Icon = iconMap[product.category] || ShoppingBag;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}>
              <Card className="card-interactive">
                <CardContent className="p-6">
                  <div className="aspect-square bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-xl flex items-center justify-center mb-4 relative">
                    <Icon className="w-16 h-16 text-secondary/50" />
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-1 bg-secondary/20 text-secondary text-xs font-medium rounded-full">
                        {product.category}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-bold text-foreground mb-2 line-clamp-2">{product.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-foreground">{product.price}</p>
                  </div>
                  <Button className="w-full" variant="outline" size="sm">
                    View Product
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </SectionComp>
  );
};
