export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  category: string;
  description: string;
  coverImage: string;
  rating: number;
  reviews: number;
  stock: number;
  featured?: boolean;
}

export interface CartItem extends Book {
  quantity: number;
}

export interface MembershipPlan {
  id: string;
  name: string;
  price: number;
  benefits: string[];
  color: string;
  badgeColor: string;
}

