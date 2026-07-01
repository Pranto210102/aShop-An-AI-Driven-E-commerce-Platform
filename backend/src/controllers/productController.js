import Product from "../models/Product.js";

// @desc    Get all products with filters and sorting
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      minRating,
      shapes,
      badges,
      sortBy,
      trending,
    } = req.query;

    // Build query object
    let query = {};

    // 1. Text Search query
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    // 2. Category Filter (comma-separated list e.g. "Furniture,Scents")
    if (category) {
      const categoriesArray = category.split(",");
      query.category = { $in: categoriesArray };
    }

    // 3. Price Range Filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // 4. Star Rating Filter
    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }

    // 5. Asymmetric Contour Shapes Filter (comma-separated list)
    if (shapes) {
      const shapesArray = shapes.split(",");
      query.shapeType = { $in: shapesArray };
    }

    // 6. Badges / Collections Filter (comma-separated list)
    if (badges) {
      const badgesArray = badges.split(",");
      query.badge = { $in: badgesArray };
    }

    // 7. Trending Products Filter
    if (trending === "true") {
      query.trendingScore = { $gt: 0 };
      query.trendingUntil = { $gt: new Date() };
    }

    // Initialize sort option
    let sortOption = {};
    if (sortBy === "price-asc" || sortBy === "price-low") {
      sortOption.price = 1;
    } else if (sortBy === "price-desc" || sortBy === "price-high") {
      sortOption.price = -1;
    } else if (sortBy === "name-asc") {
      sortOption.name = 1;
    } else if (sortBy === "name-desc") {
      sortOption.name = -1;
    } else if (sortBy === "rating") {
      sortOption.rating = -1;
    } else if (trending === "true") {
      // When filtering by trending, sort by score by default
      sortOption.trendingScore = -1;
    } else {
      // Default: featured/newest
      sortOption.createdAt = -1;
    }

    // Execute query
    let products = await Product.find(query).sort(sortOption);

    // Fallback: If requesting trending products and none match the score, return the top 8 highest-rated products
    if (trending === "true" && products.length === 0) {
      products = await Product.find({}).sort({ rating: -1, reviewsCount: -1 }).limit(8);
    }

    res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single product details by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json({ success: true, data: product });
    } else {
      res.status(404).json({ success: false, message: "Product piece not found in catalog." });
    }
  } catch (error) {
    // If invalid ObjectId structure, handle cast error safely
    if (error.kind === "ObjectId") {
      return res.status(404).json({ success: false, message: "Invalid product identifier." });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin (Public for development)
export const createProduct = async (req, res) => {
  const {
    name,
    price,
    category,
    rating,
    reviewsCount,
    shapeType,
    badge,
    imageUrl,
    description,
    stock,
  } = req.body;

  try {
    const product = await Product.create({
      name,
      price,
      category,
      rating: rating || 0,
      reviewsCount: reviewsCount || 0,
      shapeType: shapeType || "",
      badge: badge || "",
      imageUrl,
      description: description || "",
      stock: stock !== undefined ? Number(stock) : 0,
    });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update a product
// @route   PATCH /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product piece not found in catalog." });
    }

    const fieldsToUpdate = [
      "name",
      "price",
      "category",
      "rating",
      "reviewsCount",
      "shapeType",
      "badge",
      "imageUrl",
      "description",
      "stock",
      "tags",
      "trendingScore",
      "trendingUntil",
      "competitorPriceRange",
      "aiSuggestions",
    ];

    fieldsToUpdate.forEach((field) => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    const updatedProduct = await product.save();
    res.json({ success: true, data: updatedProduct });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).json({ success: false, message: "Invalid product identifier." });
    }
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Seed initial catalog data
// @route   POST /api/products/seed
// @access  Public
export const seedProducts = async (req, res) => {
  const defaultProducts = [
    {
      name: "Minimalist Bouclé Lounge Chair",
      price: 890,
      category: "Furniture",
      rating: 4.8,
      reviewsCount: 124,
      shapeType: "top-right-round",
      badge: "new",
      imageUrl: "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=800",
      description: "Art-directed lounger featuring premium Bouclé loop yarn upholstery in soft cream. Fitted on asymmetrically detailed organic timber feet, defining sculptural proportions.",
    },
    {
      name: "Travertine Arch Coffee Table",
      price: 750,
      category: "Furniture",
      rating: 4.9,
      reviewsCount: 88,
      shapeType: "oval-right",
      badge: "featured",
      imageUrl: "https://images.unsplash.com/photo-1581428982868-e410dd047a90?auto=format&fit=crop&q=80&w=800",
      description: "Sculpted from raw Italian Travertine marble blocks. The double-arch base highlights organic veins, porous character, and smooth matte finishes.",
    },
    {
      name: "Matte Black Ceramic Vase",
      price: 120,
      category: "Home Decor",
      rating: 4.5,
      reviewsCount: 56,
      shapeType: "wavy",
      badge: "sale",
      imageUrl: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&q=80&w=800",
      description: "Clay-thrown sculptural vase featuring an asymmetric silhouette. Finished with a granular textured matte carbon glaze for raw structural contrast.",
    },
    {
      name: "Wavy Organic Mirror",
      price: 195,
      category: "Home Decor",
      rating: 4.7,
      reviewsCount: 204,
      shapeType: "diagonal-round",
      badge: "",
      imageUrl: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=800",
      description: "Handcrafted wall mirror outlined in an undulating organic wood contour, adding fluid movement and warm oak tones to modern workspaces.",
    },
    {
      name: "Terrazzo Scented Soy Candle",
      price: 48,
      category: "Scents",
      rating: 4.6,
      reviewsCount: 92,
      shapeType: "",
      badge: "",
      imageUrl: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=800",
      description: "Natural hand-poured soy wax inside a polished Terrazzo stone vessel. Scented with essential oils of dark amber, sandalwood, and soft cedar notes.",
    },
  ];

  try {
    // Check if products exist already to avoid duplicate seeds
    const count = await Product.countDocuments();
    if (count > 0 && !req.body.force) {
      return res.status(400).json({
        success: false,
        message: "Catalog database is already populated. Pass { force: true } in body to override.",
      });
    }

    if (req.body.force) {
      await Product.deleteMany();
    }

    const created = await Product.insertMany(defaultProducts);
    res.status(201).json({
      success: true,
      message: `Database populated with ${created.length} catalog items.`,
      data: created,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
