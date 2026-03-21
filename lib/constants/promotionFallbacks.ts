import type {
  FeaturedOption,
  PromotionPricingOption,
  ResourceDownloadCategory,
  ContactMethod,
} from '@/lib/types/promotion';

/** Fallback data when API returns empty or errors (e.g. before backend is implemented). */
export const FEATURED_OPTIONS_FALLBACK: FeaturedOption[] = [
  {
    _id: 'fallback-1',
    title: 'Homepage Slider Banner',
    duration: '1 Week',
    price: '₦10,000',
    icon: 'home',
    description: 'Get maximum visibility on our homepage slider',
    features: ['Homepage banner placement', '7 days visibility', 'Click-through tracking'],
  },
  {
    _id: 'fallback-2',
    title: 'Trending Section',
    duration: '1 Week',
    price: '₦8,000',
    icon: 'trending-up',
    description: 'Featured in the trending section',
    features: ['Trending badge', 'Priority placement', 'Enhanced discoverability'],
  },
  {
    _id: 'fallback-3',
    title: 'Social Media Promo',
    duration: 'Flexible',
    price: '₦5,000 - ₦10,000',
    icon: 'mail',
    description: 'Promote across Facebook and Instagram',
    features: ['Multi-platform promotion', 'Custom creatives', 'Performance reports'],
  },
];

export const PRICING_OPTIONS_FALLBACK: PromotionPricingOption[] = [
  {
    _id: 'fallback-1',
    title: 'Basic Listing',
    price: '₦5,000',
    description: 'Upload your song with basic listing on the platform',
    features: ['Song listing', 'Basic search visibility', 'Artist profile link'],
    isFeatured: false,
  },
  {
    _id: 'fallback-2',
    title: 'Featured Song',
    price: '₦8,000',
    description: 'Get featured on the homepage banner',
    features: ['Homepage banner placement', 'Priority listing', 'Enhanced visibility'],
    isFeatured: true,
  },
  {
    _id: 'fallback-3',
    title: 'Artist Spotlight',
    price: '₦7,000',
    description: 'Get featured in the artist spotlight section',
    features: ['Artist spotlight feature', 'Profile enhancement', 'Social media promotion'],
    isFeatured: false,
  },
];

export const DOWNLOAD_CATEGORIES_FALLBACK: ResourceDownloadCategory[] = [
  {
    _id: 'fallback-1',
    title: 'Free E-books',
    count: '12+',
    description: 'Free Christian e-books and guides',
    icon: '📚',
    href: '#free-ebooks',
  },
  {
    _id: 'fallback-2',
    title: 'Sermon Templates',
    count: '25+',
    description: 'Professional templates and flyers',
    icon: '📄',
    href: '/community/resources',
  },
  {
    _id: 'fallback-3',
    title: 'Free Beats',
    count: '50+',
    description: 'Worship beats and instrumentals',
    icon: '🎵',
    href: '#free-beats',
  },
  {
    _id: 'fallback-4',
    title: 'Wallpapers',
    count: '100+',
    description: 'Beautiful Christian wallpapers',
    icon: '🖼️',
    href: '#wallpapers',
  },
];

export const CONTACT_METHODS_FALLBACK: ContactMethod[] = [
  {
    _id: 'fallback-1',
    method: 'Email',
    value: 'ohemultimedia@gmail.com',
    icon: 'mail',
    action: 'mailto:ohemultimedia@gmail.com',
  },
  {
    _id: 'fallback-2',
    method: 'Phone',
    value: '+234 705 692 3436',
    icon: 'phone',
    action: 'tel:+2347056923436',
  },
  {
    _id: 'fallback-3',
    method: 'WhatsApp',
    value: '+234 913 667 0466',
    icon: 'message-square',
    action: 'https://wa.me/2349136670466',
  },
];

export const PARTNERSHIP_BENEFITS_FALLBACK: string[] = [
  'Long-term sponsorship opportunities',
  'Custom advertising solutions',
  'Brand visibility across all platforms',
  'Dedicated account manager',
  'Performance tracking and reports',
  'Flexible pricing and payment options',
];

export const ADDITIONAL_CONTACT_FALLBACK = '+234 707 324 4801';
