export const mockStore = {
  _id: "67abc123def456",
  name: "Velvet Noir",
  slug: "velvet-noir",
  description:
    "Premium women's western wear with modern cuts and sustainable fabrics.",
  category: "western",
  logo: "https://images.unsplash.com/photo-1574259514741-757d1fc48f22?w=200&h=200&fit=crop",
  banner:
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop",
  rating: 4.7,
  isActive: true,
  owner: { name: "Priya Sharma", id: "owner123" },
  address: { city: "Mumbai", state: "Maharashtra", pincode: "400001" },
  phone: "9876543210",
};

export const mockProducts = [
  {
    _id: "prod1",
    name: "Floral Maxi Dress",
    slug: "floral-maxi-dress",
    price: 1299,
    discountPrice: 999,
    images: [
      "https://images.unsplash.com/photo-1578900730755-43c08a523a1b?w=300&h=400&fit=crop",
    ],
    category: "western",
    sizes: ["S", "M", "L"],
    colors: ["Pink", "Blue"],
    stock: 15,
    rating: 4.5,
    store: { _id: "67abc123def456", name: "Velvet Noir" },
  },
  // Add 11 more similar products...
];
