import dotenv from "dotenv";
import mongoose from "mongoose";
import Product from "../models/Product.js";

// Load environment variables
dotenv.config();

const IMGBB_KEY = "2ac7bd7535829d829049dc53e6f21afd";
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://spran444219_db_user:ozYAQRTHf9WK8blz@cluster0.aiptabw.mongodb.net/aShop-App?appName=Cluster0";

const productsToSeed = [
  {
    name: "Handloom Jamdani Cotton Sari",
    price: 4500,
    category: "Apparel & Apparel",
    rating: 4.9,
    reviewsCount: 28,
    shapeType: "diagonal-round",
    badge: "Exclusive",
    description: "Woven in Sonargaon using age-old geometric motifs. Light as air cotton-silk blend, representing the pinnacle of Bangladeshi textile heritage.",
    imageUrl: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "Rajshahi Silk Scarf / Hijab",
    price: 1800,
    category: "Apparel & Apparel",
    rating: 4.8,
    reviewsCount: 15,
    shapeType: "wavy",
    badge: "New Season",
    description: "Pure mulberry silk cultivated and hand-reeled in Rajshahi. Smooth tactile feel with a subtle organic sheen.",
    imageUrl: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "Hand-loomed Khadi Panjabi",
    price: 2200,
    category: "Apparel & Apparel",
    rating: 4.7,
    reviewsCount: 19,
    shapeType: "sharp-rect",
    badge: "Best Seller",
    description: "Traditional menswear spun from organic Comilla cotton. The raw weave provides breathable comfort, making it a hot weather staple.",
    imageUrl: "https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "Nakshi Kantha Embroidered Shawl",
    price: 3200,
    category: "Apparel & Apparel",
    rating: 4.9,
    reviewsCount: 12,
    shapeType: "top-right-round",
    badge: "Trending",
    description: "Detailed hand-stitched folk motifs embroidered on handloom cotton. Each piece tells a visual story of rural Bengal life.",
    imageUrl: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "Tangail Handloom Cotton Salwar Kameez",
    price: 2800,
    category: "Apparel & Apparel",
    rating: 4.8,
    reviewsCount: 22,
    shapeType: "",
    badge: "New Season",
    description: "Premium cotton woven on traditional pit looms in Tangail. Features delicate floral borders and comfortable silhouette.",
    imageUrl: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "Organic Tea Garden Cotton Kurti",
    price: 1500,
    category: "Apparel & Apparel",
    rating: 4.6,
    reviewsCount: 31,
    shapeType: "compact-box",
    badge: "",
    description: "Casual women's wear made from certified organic cotton, dyed using natural plant extracts from Sylhet's hills.",
    imageUrl: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "Handcrafted Jute & Leather Laptop Sleeve",
    price: 1250,
    category: "Aesthetic Accessories",
    rating: 4.7,
    reviewsCount: 40,
    shapeType: "sharp-rect",
    badge: "Best Seller",
    description: "Made from premium golden fiber jute and vegetable-tanned leather. Provides padded protection with a clean brutalist aesthetic.",
    imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "Nakshi Kantha Leather Tote Bag",
    price: 3800,
    category: "Aesthetic Accessories",
    rating: 4.9,
    reviewsCount: 16,
    shapeType: "oval-right",
    badge: "Exclusive",
    description: "Art-directed shoulder bag merging hand-embroidered kantha motifs with structure-retaining full-grain leather.",
    imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "Conch Shell Shankha Bangle Set",
    price: 850,
    category: "Aesthetic Accessories",
    rating: 4.8,
    reviewsCount: 11,
    shapeType: "diagonal-round",
    badge: "",
    description: "Traditional bangles hand-carved from natural sea conch shells by artisans in Shankhari Bazar, Old Dhaka.",
    imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "Folk Art Painted Jewelry Chest",
    price: 1600,
    category: "Aesthetic Accessories",
    rating: 4.7,
    reviewsCount: 9,
    shapeType: "compact-box",
    badge: "Trending",
    description: "Miniature wooden chest hand-painted with traditional folk fish and floral motifs in vibrant crimson and turmeric tones.",
    imageUrl: "https://images.unsplash.com/photo-1598124146163-36819847286d?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "Woven Jute Coasters & Tablemat Set",
    price: 650,
    category: "Aesthetic Accessories",
    rating: 4.6,
    reviewsCount: 34,
    shapeType: "",
    badge: "",
    description: "Set of 6 coasters and a center runner woven from raw jute fiber, adding natural tactile textures to dining tables.",
    imageUrl: "https://images.unsplash.com/photo-1532372320978-9b4d6a3a854c?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "Nakshi Kantha Cotton Cushion Cover",
    price: 750,
    category: "Home & Living",
    rating: 4.8,
    reviewsCount: 25,
    shapeType: "compact-box",
    badge: "Organic Form",
    description: "Detailed hand-stitched folk patterns on heavy handloom cotton backing. Adds warmth and craft character to modern couches.",
    imageUrl: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "Clay Terracotta Bijoypur Water Pot",
    price: 450,
    category: "Home & Living",
    rating: 4.8,
    reviewsCount: 14,
    shapeType: "wavy",
    badge: "Organic Form",
    description: "Sculptural clay pot fired in traditional wood kilns. Its porous terracotta body keeps water naturally cool.",
    imageUrl: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "Rickshaw Art Painted Wooden Tray",
    price: 1200,
    category: "Home & Living",
    rating: 4.9,
    reviewsCount: 18,
    shapeType: "sharp-rect",
    badge: "Trending",
    description: "High-gloss wooden serving tray hand-painted with iconic rickshaw motifs, birds, and bright floral patterns.",
    imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "Hand-woven Jute Area Rug",
    price: 3500,
    category: "Home & Living",
    rating: 4.7,
    reviewsCount: 30,
    shapeType: "oval-right",
    badge: "Best Seller",
    description: "Braided and hand-stitched organic jute area rug. Neutral tones and sturdy texture highlight local golden fiber crafts.",
    imageUrl: "https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "Sonargaon Handloom Bamboo Picnic Basket",
    price: 950,
    category: "Home & Living",
    rating: 4.7,
    reviewsCount: 12,
    shapeType: "top-right-round",
    badge: "",
    description: "Woven split-bamboo basket with dual handles and secure clasp, hand-crafted by master basket-weavers.",
    imageUrl: "https://images.unsplash.com/photo-1590736969955-71cb94801759?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "Clay Shokhher Hari / Folk Painted Pot",
    price: 850,
    category: "Home & Living",
    rating: 4.8,
    reviewsCount: 15,
    shapeType: "diagonal-round",
    badge: "Exclusive",
    description: "Traditional Rajshahi festival pot painted with geometric lines and symbolic red, yellow, and green fish motifs.",
    imageUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "Handcrafted Brass Tea Pot & Cups Set",
    price: 3400,
    category: "Home & Living",
    rating: 4.9,
    reviewsCount: 20,
    shapeType: "wavy",
    badge: "Exclusive",
    description: "Heavy brass teapot with four cups. Hand-beaten detailing provides unique dimpled finishes reflecting Dhaka metal crafts.",
    imageUrl: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "Nakshi Kantha Warm Bedspread",
    price: 5200,
    category: "Home & Living",
    rating: 5.0,
    reviewsCount: 10,
    shapeType: "",
    badge: "Limited Run",
    description: "Double-layered cotton quilt embroidered with intricate rural patterns. Provides warmth with unparalleled artisan craft.",
    imageUrl: "https://images.unsplash.com/photo-1543294001-f7cbfe92237e?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "Water Hyacinth Woven Storage Box",
    price: 1100,
    category: "Home & Living",
    rating: 4.6,
    reviewsCount: 26,
    shapeType: "sharp-rect",
    badge: "",
    description: "Storage box woven from dried water hyacinth stalks over an iron frame. Highly durable and eco-friendly.",
    imageUrl: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "Rickshaw Art Painted Ceramic Plate",
    price: 750,
    category: "Home & Living",
    rating: 4.8,
    reviewsCount: 13,
    shapeType: "diagonal-round",
    badge: "",
    description: "Display plate painted in traditional Rickshaw art style, depicting a majestic taj mahal with floral borders.",
    imageUrl: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "Handloom Monipuri Cotton Bedspread",
    price: 2900,
    category: "Home & Living",
    rating: 4.8,
    reviewsCount: 17,
    shapeType: "",
    badge: "New Season",
    description: "Woven in Sylhet's Monipuri community, featuring distinct linear geometric patterns on breathable heavy-weight cotton.",
    imageUrl: "https://images.unsplash.com/photo-1528938102132-4a9276b8e320?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "Sculptural Clay Terracotta Wall Plaque",
    price: 950,
    category: "Home & Living",
    rating: 4.7,
    reviewsCount: 7,
    shapeType: "top-right-round",
    badge: "",
    description: "Fired clay wall decor portraying village activities. Inspired by the structures of Kantajew Temple, Dinajpur.",
    imageUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "Sundarbans Wild Honey Scented Candle",
    price: 450,
    category: "Scents & Candles",
    rating: 4.8,
    reviewsCount: 42,
    shapeType: "compact-box",
    badge: "Best Seller",
    description: "Naturally sweet, warm honey and beeswax scented candle. Enclosed in a custom reusable clay bowl.",
    imageUrl: "https://images.unsplash.com/photo-1602872030219-aa117d3d49ec?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "Sylhet Orange & Spice Soy Candle",
    price: 420,
    category: "Scents & Candles",
    rating: 4.7,
    reviewsCount: 33,
    shapeType: "oval-right",
    badge: "Trending",
    description: "Soy wax blend infused with oils of Sylhet wild oranges, cinnamon, and cloves for a refreshing citrus spice scent.",
    imageUrl: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "Kewra & Sandalwood Reed Diffuser",
    price: 1350,
    category: "Scents & Candles",
    rating: 4.8,
    reviewsCount: 15,
    shapeType: "wavy",
    badge: "New Season",
    description: "Long-lasting fragrance diffuser. Notes of aromatic Kewra flower water combined with rich white Mysore Sandalwood.",
    imageUrl: "https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "Rosewater & Amber Soy Wax Melts",
    price: 320,
    category: "Scents & Candles",
    rating: 4.6,
    reviewsCount: 21,
    shapeType: "",
    badge: "Hot Buy",
    description: "Melt cubes scented with pure Mughal rosewater and amber resin. Perfect for warm, relaxing home vibes.",
    imageUrl: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "Traditional Brass Incense Burner (Dhupdani)",
    price: 1450,
    category: "Scents & Candles",
    rating: 4.9,
    reviewsCount: 19,
    shapeType: "diagonal-round",
    badge: "Trending",
    description: "Heavy solid brass hand-carved incense burner. Featuring a long wooden handle to easily carry smoke and cleanse spaces.",
    imageUrl: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "Rickshaw Art: A Visual History",
    price: 1800,
    category: "Art & Books",
    rating: 4.9,
    reviewsCount: 14,
    shapeType: "",
    badge: "Limited Run",
    description: "Hardcover coffee table book containing 200 pages of high-resolution rickshaw paintings, banners, and artisan profiles.",
    imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "Folk Crafts of Bengal Illustrated Book",
    price: 1200,
    category: "Art & Books",
    rating: 4.8,
    reviewsCount: 8,
    shapeType: "top-right-round",
    badge: "",
    description: "Comprehensive guide to handloom weaving, terracotta, shell carvings, and brassworks of Bangladesh.",
    imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800"
  }
];

// Helper function to download remote Unsplash image and upload it to ImgBB
const processImageUpload = async (url, name) => {
  try {
    // 1. Fetch image from unsplash
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);
    const buffer = await response.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString("base64");

    // 2. Upload to ImgBB
    const uploadRes = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: `image=${encodeURIComponent(base64Image)}`
    });

    const data = await uploadRes.json();
    if (data.success) {
      return data.data.url;
    } else {
      throw new Error(data.error?.message || "ImgBB upload error.");
    }
  } catch (error) {
    console.error(`[Image Upload Failed for ${name}]: ${error.message}. Using fallback direct URL.`);
    return url; // fallback to unsplash direct URL if ImgBB fails
  }
};

const run = async () => {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected successfully!");

    // Delete existing products to avoid pollution if needed
    console.log("Cleaning existing products...");
    await Product.deleteMany({});

    console.log(`Starting uploads and seeding for ${productsToSeed.length} products...`);
    const seededList = [];

    for (let i = 0; i < productsToSeed.length; i++) {
      const p = productsToSeed[i];
      console.log(`[${i + 1}/30] Processing: "${p.name}"...`);
      const hostedUrl = await processImageUpload(p.imageUrl, p.name);
      console.log(`Uploaded successfully! Hosted URL: ${hostedUrl}`);

      seededList.push({
        ...p,
        imageUrl: hostedUrl
      });
    }

    console.log("Saving seeded products to database...");
    const createdDocs = await Product.insertMany(seededList);
    console.log(`✅ Successfully seeded ${createdDocs.length} products with hosted ImgBB images!`);

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

run();
