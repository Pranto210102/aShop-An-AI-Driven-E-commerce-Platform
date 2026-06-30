import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Product from "../models/Product.js";

// Load environment variables
dotenv.config();

const IMGBB_KEY = "2ac7bd7535829d829049dc53e6f21afd";
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://spran444219_db_user:ozYAQRTHf9WK8blz@cluster0.aiptabw.mongodb.net/aShop-App?appName=Cluster0";

// Define absolute image paths
const imagesToUpload = [
  {
    name: "Travertine Block Pedestal Side Table",
    price: 620,
    category: "Furniture",
    rating: 4.9,
    reviewsCount: 14,
    shapeType: "oval-right",
    badge: "new",
    description: "Sculpted from a single block of raw cream-colored Travertine stone, highlighting its natural crystalline formations and organic textures.",
    filePath: "C:/Users/Pranto/.gemini/antigravity-ide/brain/b45edfca-a344-4ee3-b14f-2071e2d289aa/travertine_side_table_1782792262436.png"
  },
  {
    name: "Hand-thrown Clay Terracotta Vase",
    price: 165,
    category: "Home Decor",
    rating: 4.7,
    reviewsCount: 8,
    shapeType: "wavy",
    badge: "featured",
    description: "Thrown by hand in organic clay, highlighting granular mineral inclusions and detailed concentric firing lines.",
    filePath: "C:/Users/Pranto/.gemini/antigravity-ide/brain/b45edfca-a344-4ee3-b14f-2071e2d289aa/terracotta_vase_1782792281368.png"
  },
  {
    name: "Sculptured Alabaster Stone Pendant Light",
    price: 380,
    category: "Home Decor",
    rating: 4.8,
    reviewsCount: 11,
    shapeType: "top-right-round",
    badge: "",
    description: "Hand-turned white alabaster stone cup hanging from a solid brass fixture, projecting warm translucent illumination.",
    filePath: "C:/Users/Pranto/.gemini/antigravity-ide/brain/b45edfca-a344-4ee3-b14f-2071e2d289aa/alabaster_pendant_1782792298050.png"
  }
];

// Helper function to upload image to ImgBB
const uploadToImgBB = async (filePath) => {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const base64Image = fs.readFileSync(filePath, { encoding: "base64" });
  
  // Post using url-encoded body parameter 'image'
  const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: `image=${encodeURIComponent(base64Image)}`
  });

  const data = await response.json();
  if (data.success) {
    return data.data.url;
  } else {
    throw new Error(data.error?.message || "ImgBB upload failed.");
  }
};

const runSeeder = async () => {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected successfully to database cluster!");

    console.log("\n--- Starting ImgBB Product Image Uploads ---");
    const seededProducts = [];

    for (const item of imagesToUpload) {
      console.log(`Uploading image for "${item.name}"...`);
      const hostedUrl = await uploadToImgBB(item.filePath);
      console.log(`Uploaded successfully! Hosted URL: ${hostedUrl}`);

      seededProducts.push({
        name: item.name,
        price: item.price,
        category: item.category,
        rating: item.rating,
        reviewsCount: item.reviewsCount,
        shapeType: item.shapeType,
        badge: item.badge,
        description: item.description,
        imageUrl: hostedUrl
      });
    }

    console.log("\n--- Inserting Products into MongoDB Atlas ---");
    const docs = await Product.insertMany(seededProducts);
    console.log(`Seeded ${docs.length} products successfully!`);
    console.log(docs);

    process.exit(0);
  } catch (error) {
    console.error("Seeding Error:", error);
    process.exit(1);
  }
};

runSeeder();
