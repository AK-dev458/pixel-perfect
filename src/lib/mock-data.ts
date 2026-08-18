export type ProductStatus = "Researching" | "Approved" | "Rejected";

export type Supplier = {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  website: string;
  category: string;
  notes: string;
};

export type Product = {
  id: string;
  name: string;
  sku: string;
  asin: string;
  category: string;
  supplierId: string;
  buyCost: number;
  sellingPrice: number;
  fees: number;
  quantity: number;
  notes: string;
  status: ProductStatus;
  createdAt: string;
};

export const CATEGORIES = [
  "Home & Kitchen",
  "Health & Household",
  "Pet Supplies",
  "Toys & Games",
  "Sports & Outdoors",
  "Office Products",
  "Beauty & Personal Care",
  "Tools & Home Improvement",
];

export const STATUSES: ProductStatus[] = ["Researching", "Approved", "Rejected"];

export const MOCK_SUPPLIERS: Supplier[] = [
  {
    id: "sup-1",
    name: "Northwind Wholesale Co.",
    contactName: "Dana Whitfield",
    email: "dana@northwindwholesale.com",
    phone: "(312) 555-0148",
    website: "www.northwindwholesale.com",
    category: "Home & Kitchen",
    notes: "Net 30 terms after third order. Free freight above $2,500.",
  },
  {
    id: "sup-2",
    name: "Bluegrass Distribution",
    contactName: "Marcus Reed",
    email: "m.reed@bluegrassdist.com",
    phone: "(502) 555-0193",
    website: "www.bluegrassdist.com",
    category: "Health & Household",
    notes: "Requires resale certificate. Ships from Louisville, KY.",
  },
  {
    id: "sup-3",
    name: "Harborline Supply Group",
    contactName: "Priya Raman",
    email: "priya@harborlinesupply.com",
    phone: "(206) 555-0121",
    website: "www.harborlinesupply.com",
    category: "Pet Supplies",
    notes: "Strong on private-label pet accessories. MOQ 48 units.",
  },
  {
    id: "sup-4",
    name: "Cedar Peak Traders",
    contactName: "Owen Blackwell",
    email: "owen@cedarpeaktraders.com",
    phone: "(720) 555-0177",
    website: "www.cedarpeaktraders.com",
    category: "Sports & Outdoors",
    notes: "Seasonal catalog refresh each February. Pallet pricing available.",
  },
  {
    id: "sup-5",
    name: "Lantern Office Brands",
    contactName: "Sofia Marchetti",
    email: "sofia@lanternoffice.com",
    phone: "(617) 555-0165",
    website: "www.lanternoffice.com",
    category: "Office Products",
    notes: "Prepaid orders only for first 90 days.",
  },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "prd-1",
    name: "Stoneware 12-Piece Dinnerware Set",
    sku: "NW-DINE-12S",
    asin: "B08KQ4M2XT",
    category: "Home & Kitchen",
    supplierId: "sup-1",
    buyCost: 21.4,
    sellingPrice: 58.99,
    fees: 14.2,
    quantity: 120,
    notes: "Two competing sellers, both FBA. Fragile — needs overbox.",
    status: "Approved",
    createdAt: "2026-06-02",
  },
  {
    id: "prd-2",
    name: "Cast Iron Grill Press, 8 in",
    sku: "NW-GRLP-08",
    asin: "B07YHT9K3D",
    category: "Home & Kitchen",
    supplierId: "sup-1",
    buyCost: 8.75,
    sellingPrice: 24.5,
    fees: 7.1,
    quantity: 240,
    notes: "Steady BSR under 9,000 for six months.",
    status: "Approved",
    createdAt: "2026-06-11",
  },
  {
    id: "prd-3",
    name: "Electrolyte Hydration Powder, 30 Sticks",
    sku: "BG-HYDR-30",
    asin: "B09XZ1L7QV",
    category: "Health & Household",
    supplierId: "sup-2",
    buyCost: 12.9,
    sellingPrice: 29.95,
    fees: 9.4,
    quantity: 300,
    notes: "Watch expiration dating — request 12+ months remaining.",
    status: "Researching",
    createdAt: "2026-07-01",
  },
  {
    id: "prd-4",
    name: "Compression Ankle Sleeve, 2-Pack",
    sku: "BG-ANKL-2P",
    asin: "B085RT4WQZ",
    category: "Health & Household",
    supplierId: "sup-2",
    buyCost: 6.2,
    sellingPrice: 15.99,
    fees: 6.35,
    quantity: 180,
    notes: "Margin is thin at current buy box price.",
    status: "Rejected",
    createdAt: "2026-07-04",
  },
  {
    id: "prd-5",
    name: "Orthopedic Memory Foam Dog Bed, Large",
    sku: "HL-DOGB-L",
    asin: "B0913FVN8P",
    category: "Pet Supplies",
    supplierId: "sup-3",
    buyCost: 26.5,
    sellingPrice: 74.0,
    fees: 18.9,
    quantity: 90,
    notes: "Oversize tier — confirm dimensional fees before scaling.",
    status: "Approved",
    createdAt: "2026-07-09",
  },
  {
    id: "prd-6",
    name: "Stainless Slow-Feed Cat Bowl",
    sku: "HL-CATB-SS",
    asin: "B08M3JQ7RL",
    category: "Pet Supplies",
    supplierId: "sup-3",
    buyCost: 4.15,
    sellingPrice: 13.49,
    fees: 5.6,
    quantity: 420,
    notes: "Good rebuy candidate, low return rate.",
    status: "Researching",
    createdAt: "2026-07-15",
  },
  {
    id: "prd-7",
    name: "Insulated Trail Backpack, 28L",
    sku: "CP-TRAIL-28",
    asin: "B07QK8YMD4",
    category: "Sports & Outdoors",
    supplierId: "sup-4",
    buyCost: 19.8,
    sellingPrice: 52.0,
    fees: 13.75,
    quantity: 140,
    notes: "Seasonal spike May–August.",
    status: "Approved",
    createdAt: "2026-07-19",
  },
  {
    id: "prd-8",
    name: "Adjustable Resistance Band Kit",
    sku: "CP-BAND-KIT",
    asin: "B08LLZ6TWG",
    category: "Sports & Outdoors",
    supplierId: "sup-4",
    buyCost: 7.6,
    sellingPrice: 21.99,
    fees: 7.85,
    quantity: 260,
    notes: "Brand gated — ungating request submitted.",
    status: "Researching",
    createdAt: "2026-07-24",
  },
  {
    id: "prd-9",
    name: "Ergonomic Mesh Task Chair",
    sku: "LO-CHAIR-MS",
    asin: "B09NNQ2VHB",
    category: "Office Products",
    supplierId: "sup-5",
    buyCost: 62.0,
    sellingPrice: 149.0,
    fees: 36.4,
    quantity: 45,
    notes: "High return rate risk on assembly complaints.",
    status: "Researching",
    createdAt: "2026-08-01",
  },
  {
    id: "prd-10",
    name: "Laminated Dry-Erase Weekly Planner",
    sku: "LO-PLAN-DE",
    asin: "B086WT3XZ9",
    category: "Office Products",
    supplierId: "sup-5",
    buyCost: 3.4,
    sellingPrice: 11.95,
    fees: 5.15,
    quantity: 500,
    notes: "Q4 gifting bump expected.",
    status: "Approved",
    createdAt: "2026-08-05",
  },
  {
    id: "prd-11",
    name: "Wooden Montessori Stacking Toy",
    sku: "NW-TOYS-MS",
    asin: "B08RRW1KQD",
    category: "Toys & Games",
    supplierId: "sup-1",
    buyCost: 9.25,
    sellingPrice: 22.0,
    fees: 8.6,
    quantity: 160,
    notes: "Requires CPC documentation from supplier.",
    status: "Rejected",
    createdAt: "2026-08-08",
  },
  {
    id: "prd-12",
    name: "Vitamin C Brightening Serum, 1 oz",
    sku: "BG-SERM-1OZ",
    asin: "B07ZZP4LKM",
    category: "Beauty & Personal Care",
    supplierId: "sup-2",
    buyCost: 8.1,
    sellingPrice: 26.5,
    fees: 8.95,
    quantity: 210,
    notes: "Strong repeat purchase rate in category.",
    status: "Approved",
    createdAt: "2026-08-12",
  },
];

export const DEMO_CREDENTIALS = {
  email: "demo@profitscout.com",
  password: "demo123",
  name: "Alex Morgan",
};
