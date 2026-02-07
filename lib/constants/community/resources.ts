/**
 * Unified Resource Item Type
 * This type represents all resource content.
 * Items are marked with type to indicate which section they belong to.
 */
export interface ResourceItem {
  _id: string;
  title: string;
  description: string;
  downloads: string;
  // Type-specific fields
  type: 'ebook' | 'template' | 'beat' | 'wallpaper' | 'affiliate';
  // Ebook fields
  cover?: string;
  // Template fields
  templateType?: string;
  // Beat fields
  genre?: string;
  // Wallpaper fields
  category?: string;
  image?: string;
  // Affiliate product fields
  price?: string;
  productCategory?: string;
  // Detail page fields
  fileUrl?: string;
  previewUrl?: string;
  tags?: string[];
  date?: string;
}

/**
 * Central array of all resource items
 */
export const RESOURCES_ITEMS: ResourceItem[] = [
  // Ebooks
  {
    _id: '1',
    title: 'Prayer Guide: 30 Days of Prayer',
    description: 'A comprehensive guide to deepen your prayer life',
    downloads: '1.2K',
    type: 'ebook',
    cover: '/placeholder.svg',
    fileUrl: 'https://example.com/downloads/prayer-guide.pdf',
    previewUrl: 'https://example.com/preview/prayer-guide.pdf',
    tags: ['prayer', 'guide', '30-days'],
    date: '2026-01-15',
  },
  {
    _id: '2',
    title: 'Bible Study Methods',
    description: 'Learn effective methods for studying the Bible',
    downloads: '890',
    type: 'ebook',
    cover: '/placeholder.svg',
    fileUrl: 'https://example.com/downloads/bible-study-methods.pdf',
    tags: ['bible-study', 'methods', 'learning'],
    date: '2026-01-10',
  },
  {
    _id: '3',
    title: 'Christian Living Principles',
    description: 'Essential principles for daily Christian living',
    downloads: '650',
    type: 'ebook',
    cover: '/placeholder.svg',
    fileUrl: 'https://example.com/downloads/christian-living.pdf',
    tags: ['christian-living', 'principles', 'daily'],
    date: '2026-01-05',
  },
  {
    _id: '4',
    title: 'Worship & Praise Handbook',
    description: 'Understanding worship and its importance',
    downloads: '1.5K',
    type: 'ebook',
    cover: '/placeholder.svg',
    fileUrl: 'https://example.com/downloads/worship-handbook.pdf',
    tags: ['worship', 'praise', 'handbook'],
    date: '2025-12-28',
  },
  // Beats
  {
    _id: '9',
    title: 'Worship Beat Pack',
    description: '10 professional worship beats for your ministry',
    downloads: '2.1K',
    type: 'beat',
    genre: 'Worship',
    fileUrl: 'https://example.com/downloads/worship-beat-pack.zip',
    previewUrl: 'https://example.com/preview/worship-beat-1.mp3',
    tags: ['worship', 'beats', 'music'],
    date: '2026-01-22',
  },
  {
    _id: '10',
    title: 'Gospel Instrumentals',
    description: 'High-quality gospel instrumentals collection',
    downloads: '1.8K',
    type: 'beat',
    genre: 'Gospel',
    fileUrl: 'https://example.com/downloads/gospel-instrumentals.zip',
    previewUrl: 'https://example.com/preview/gospel-instrumental-1.mp3',
    tags: ['gospel', 'instrumentals', 'music'],
    date: '2026-01-20',
  },
  {
    _id: '11',
    title: 'Praise & Worship Loops',
    description: 'Ready-to-use loops for praise sessions',
    downloads: '1.5K',
    type: 'beat',
    genre: 'Praise',
    fileUrl: 'https://example.com/downloads/praise-worship-loops.zip',
    previewUrl: 'https://example.com/preview/praise-loop-1.mp3',
    tags: ['praise', 'worship', 'loops'],
    date: '2026-01-18',
  },
  {
    _id: '12',
    title: 'Contemporary Christian Beats',
    description: 'Modern beats for contemporary worship',
    downloads: '1.2K',
    type: 'beat',
    genre: 'Contemporary',
    fileUrl: 'https://example.com/downloads/contemporary-beats.zip',
    previewUrl: 'https://example.com/preview/contemporary-beat-1.mp3',
    tags: ['contemporary', 'beats', 'worship'],
    date: '2026-01-15',
  },
  // Wallpapers
  {
    _id: '13',
    title: 'Inspirational Quotes',
    description: 'Beautiful wallpapers with inspirational Christian quotes',
    downloads: '3.5K',
    type: 'wallpaper',
    category: 'Quotes',
    image: '/placeholder.svg',
    fileUrl: 'https://example.com/downloads/inspirational-quotes-wallpapers.zip',
    previewUrl: 'https://example.com/preview/inspirational-quote-1.jpg',
    tags: ['quotes', 'wallpapers', 'inspirational'],
    date: '2026-01-25',
  },
  {
    _id: '14',
    title: 'Bible Verse Wallpapers',
    description: 'Scripture-based wallpapers for your devices',
    downloads: '2.9K',
    type: 'wallpaper',
    category: 'Scripture',
    image: '/placeholder.svg',
    fileUrl: 'https://example.com/downloads/bible-verse-wallpapers.zip',
    previewUrl: 'https://example.com/preview/bible-verse-1.jpg',
    tags: ['bible', 'verses', 'wallpapers'],
    date: '2026-01-23',
  },
  {
    _id: '15',
    title: 'Worship Wallpapers',
    description: 'Stunning worship-themed wallpapers',
    downloads: '2.1K',
    type: 'wallpaper',
    category: 'Worship',
    image: '/placeholder.svg',
    fileUrl: 'https://example.com/downloads/worship-wallpapers.zip',
    previewUrl: 'https://example.com/preview/worship-wallpaper-1.jpg',
    tags: ['worship', 'wallpapers', 'themed'],
    date: '2026-01-21',
  },
  {
    _id: '16',
    title: 'Prayer Wallpapers',
    description: 'Peaceful prayer-themed backgrounds',
    downloads: '1.8K',
    type: 'wallpaper',
    category: 'Prayer',
    image: '/placeholder.svg',
    fileUrl: 'https://example.com/downloads/prayer-wallpapers.zip',
    previewUrl: 'https://example.com/preview/prayer-wallpaper-1.jpg',
    tags: ['prayer', 'wallpapers', 'peaceful'],
    date: '2026-01-19',
  },
  // Affiliate Products
  {
    _id: '17',
    title: 'Christian Books Collection',
    description: 'Recommended Christian books for spiritual growth',
    downloads: '0',
    type: 'affiliate',
    productCategory: 'Books',
    price: 'From ₦2,500',
    fileUrl: 'https://example.com/affiliate/christian-books',
    tags: ['books', 'christian', 'growth'],
    date: '2026-01-24',
  },
  {
    _id: '18',
    title: 'Bible Study Gadgets',
    description: 'Tablets and devices perfect for Bible study',
    downloads: '0',
    type: 'affiliate',
    productCategory: 'Gadgets',
    price: 'From ₦15,000',
    fileUrl: 'https://example.com/affiliate/bible-study-gadgets',
    tags: ['gadgets', 'bible-study', 'devices'],
    date: '2026-01-22',
  },
  {
    _id: '19',
    title: 'Worship Equipment',
    description: 'Quality audio equipment for worship ministry',
    downloads: '0',
    type: 'affiliate',
    productCategory: 'Equipment',
    price: 'From ₦25,000',
    fileUrl: 'https://example.com/affiliate/worship-equipment',
    tags: ['equipment', 'worship', 'audio'],
    date: '2026-01-20',
  },
  {
    _id: '20',
    title: 'Christian Apparel',
    description: 'Faith-inspired clothing and accessories',
    downloads: '0',
    type: 'affiliate',
    productCategory: 'Apparel',
    price: 'From ₦3,000',
    fileUrl: 'https://example.com/affiliate/christian-apparel',
    tags: ['apparel', 'clothing', 'accessories'],
    date: '2026-01-18',
  },
];
