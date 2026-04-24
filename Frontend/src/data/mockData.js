export const products = [
  {
    id: 'p1',
    name: 'Wool Atelier Coat',
    price: 420.00,
    images: ['/assets/products/wool_coat.png'],
    category: 'Outerwear',
    sizes: ['S', 'M', 'L', 'XL'],
    stockPerSize: { S: 5, M: 8, L: 3, XL: 2 },
    description: 'A premium Merino blend sand beige wool coat. Designed with a minimalist silhouette and a belt for tailored excellence. Perfect for the modern digital nomad.',
    tags: ['Sustainable', 'Premium', 'New Arrival'],
    store: 'Lumière Studio'
  },
  {
    id: 'p2',
    name: 'Signature Crewneck',
    price: 145.00,
    images: ['/assets/products/crewneck.png'],
    category: 'Essentials',
    sizes: ['S', 'M', 'L', 'XL'],
    stockPerSize: { S: 12, M: 15, L: 10, XL: 5 },
    description: 'Heavyweight organic cotton navy crewneck sweatshirt. Features a refined fit and durable construction. A timeless essential for any wardrobe.',
    tags: ['Organic', 'Essentials', 'Best Seller'],
    store: 'Onyx Collective'
  },
  {
    id: 'p3',
    name: 'Aurelian Silk Scarf',
    price: 290.00,
    images: ['/assets/products/silk_scarf.png'],
    category: 'Accessories',
    sizes: ['One Size'],
    stockPerSize: { 'One Size': 20 },
    description: 'Hand-rolled 100% silk scarf with intricate Gold and Black patterns. Adds a touch of luxury and prestige to any outfit.',
    tags: ['Silk', 'Luxury', 'Limited Edition'],
    store: 'Lumière Studio'
  },
  {
    id: 'p4',
    name: 'Architectural Trousers',
    price: 210.00,
    images: ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=800'],
    category: 'Bottoms',
    sizes: ['S', 'M', 'L', 'XL'],
    stockPerSize: { S: 4, M: 6, L: 4, XL: 2 },
    description: 'Tapered fit charcoal grey trousers designed with architectural precision. Made from premium tech-fabrics for comfort and style.',
    tags: ['Techwear', 'Modern', 'Tailored'],
    store: 'Onyx Collective'
  }
];

export const stores = [
  {
    id: 's1',
    name: 'Milan Atelier',
    description: 'Located in the heart of Quadrilatero della Moda, offering our complete heritage collection.',
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1974&auto=format&fit=crop',
    tags: ['Heritage', 'Milan', 'Luxury']
  },
  {
    id: 's2',
    name: 'Ginza Hub',
    description: 'A tech-integrated space featuring digital fitting rooms and limited bespoke series.',
    image: 'https://images.unsplash.com/photo-15420518418c7-59496ba34627?q=80&w=2070&auto=format&fit=crop',
    tags: ['Tech-Integrated', 'Tokyo', 'Bespoke']
  },
  {
    id: 's3',
    name: 'SoHo Loft',
    description: 'Industrial aesthetics meeting couture precision in the heart of New York City.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop',
    tags: ['Industrial', 'NYC', 'Couture']
  },
  {
    id: 's4',
    name: 'Paris Avenue',
    description: "The ultimate expression of ClothMart's DNA. Exquisite tailoring meets art gallery design.",
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop',
    tags: ['Flagship', 'Paris', 'Artisanal']
  }
];

export const categories = ['All', 'Outerwear', 'Essentials', 'Accessories', 'Bottoms'];
