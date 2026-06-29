export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  rating: number;
  reviewsCount: number;
  badge?: string;
  description?: string;
  shapeType?: 'top-right-round' | 'oval-right' | 'sharp-rect' | 'wavy' | 'compact-box' | 'diagonal-round';
}

export const CATEGORIES = [
  "New Arrivals",
  "Apparel & Apparel",
  "Home & Living",
  "Aesthetic Accessories",
  "Scents & Candles",
  "Art & Books"
];

export const TRENDING_PRODUCTS: Product[] = [
  {
    id: "t1",
    name: "Minimalist Bouclé Lounge Chair",
    price: 890,
    category: "Home & Living",
    imageUrl: "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=800",
    rating: 4.9,
    reviewsCount: 42,
    badge: "Best Seller",
    description: "Sculptural lounge chair upholstered in a premium cream bouclé fabric, offering organic curves and extreme comfort."
  },
  {
    id: "t2",
    name: "Suede Hobo Slouch Bag",
    price: 320,
    category: "Aesthetic Accessories",
    imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800",
    rating: 4.8,
    reviewsCount: 29,
    badge: "New Season",
    description: "Crafted from Italian calfskin suede, featuring a soft relaxed silhouette and adjustable shoulder strap."
  },
  {
    id: "t3",
    name: "Brutalist Ceramic Pendant Light",
    price: 245,
    category: "Home & Living",
    imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800",
    rating: 4.7,
    reviewsCount: 18,
    description: "Hand-thrown coarse clay pendant light, emitting a warm atmospheric glow over any modern workspace."
  },
  {
    id: "t4",
    name: "Oversized Merino Wool Cardigan",
    price: 180,
    category: "Apparel & Apparel",
    imageUrl: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=800",
    rating: 4.9,
    reviewsCount: 56,
    badge: "Trending",
    description: "Spun from exceptionally soft 100% merino wool in an earthy sand color, with ribbed cuffs and horn buttons."
  },
  {
    id: "t5",
    name: "Terrazzo Scented Soy Candle",
    price: 48,
    category: "Scents & Candles",
    imageUrl: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=800",
    rating: 4.6,
    reviewsCount: 74,
    description: "Notes of sandalwood, cedar, and vetiver encased in a reusable, polished terrazzo concrete vessel."
  }
];

export const GRID_PRODUCTS: Product[] = [
  {
    id: "g1",
    name: "Sculptural Terracotta Vase",
    price: 85,
    category: "Home & Living",
    imageUrl: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&q=80&w=800",
    rating: 4.8,
    reviewsCount: 31,
    badge: "Organic Form",
    shapeType: "top-right-round" // Card 1: rounded-tr
  },
  {
    id: "g2",
    name: "Fluid Travertine Side Table",
    price: 490,
    category: "Home & Living",
    imageUrl: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=800",
    rating: 5.0,
    reviewsCount: 8,
    badge: "Exclusive",
    shapeType: "oval-right" // Card 2: rounded-r-full or semi-oval
  },
  {
    id: "g3",
    name: "Classic Linen Trench Coat",
    price: 260,
    category: "Apparel & Apparel",
    imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800",
    rating: 4.7,
    reviewsCount: 22,
    shapeType: "sharp-rect" // Card 3: sharp rectangular
  },
  {
    id: "g4",
    name: "Wavy Organic Mirror",
    price: 195,
    category: "Home & Living",
    imageUrl: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=800",
    rating: 4.9,
    reviewsCount: 15,
    badge: "Hot Buy",
    shapeType: "wavy" // Card 4: wavy
  },
  {
    id: "g5",
    name: "Sage Leaf Incense Plate",
    price: 32,
    category: "Scents & Candles",
    imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800",
    rating: 4.5,
    reviewsCount: 61,
    shapeType: "compact-box" // Card 5: compact square
  },
  {
    id: "g6",
    name: "Asymmetrical Ceramic Pitcher",
    price: 75,
    category: "Art & Books",
    imageUrl: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=800",
    rating: 4.8,
    reviewsCount: 14,
    badge: "Limited Run",
    shapeType: "diagonal-round" // Card 6: rounded diagonal
  }
];
