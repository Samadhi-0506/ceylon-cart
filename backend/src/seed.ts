import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User';
import Category from './models/Category';
import Product from './models/Product';

dotenv.config();

const categories = [
  {
    name: 'Vegetables',
    slug: 'vegetables',
    description: 'Fresh locally-grown Sri Lankan vegetables',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400',
    color: '#22c55e',
    icon: '🥦'
  },
  {
    name: 'Fruits',
    slug: 'fruits',
    description: 'Tropical and seasonal fruits from Sri Lanka',
    image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400',
    color: '#f59e0b',
    icon: '🍍'
  },
  {
    name: 'Cakes & Sweets',
    slug: 'cakes',
    description: 'Traditional Sri Lankan sweets and bakery items',
    image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400',
    color: '#ec4899',
    icon: '🍰'
  },
  {
    name: 'Biscuits & Snacks',
    slug: 'biscuits',
    description: 'Crispy biscuits and local snacks',
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400',
    color: '#f97316',
    icon: '🍪'
  },
  {
    name: 'Dairy & Eggs',
    slug: 'dairy',
    description: 'Fresh dairy products and farm eggs',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400',
    color: '#6366f1',
    icon: '🥛'
  },
  {
    name: 'Spices',
    slug: 'spices',
    description: 'Authentic Sri Lankan spices and condiments',
    image: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=400',
    color: '#ef4444',
    icon: '🌶️'
  },
  {
    name: 'Rice & Grains',
    slug: 'rice-grains',
    description: 'Premium Ceylon rice and grain varieties',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
    color: '#84cc16',
    icon: '🌾'
  },
  {
    name: 'Beverages',
    slug: 'beverages',
    description: 'Ceylon tea, coconut water, and local drinks',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400',
    color: '#14b8a6',
    icon: '🍵'
  }
];

const getProducts = (categoryMap: Record<string, mongoose.Types.ObjectId>) => [
  // Vegetables
  { name: 'Gotukola (Centella)', description: 'Fresh gotukola leaves, used in sambol and salads. Rich in vitamins.', price: 85, originalPrice: 100, image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400', category: categoryMap['vegetables'], stock: 150, unit: 'bunch', isFeatured: true, rating: 4.7, reviewCount: 124, tags: ['fresh', 'local', 'organic'] },
  { name: 'Brinjal (Eggplant)', description: 'Purple brinjal perfect for Sri Lankan curry. Farm fresh.', price: 120, originalPrice: 150, image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400', category: categoryMap['vegetables'], stock: 200, unit: 'kg', isFeatured: false, rating: 4.5, reviewCount: 89, tags: ['curry', 'fresh'] },
  { name: 'Bitter Gourd (Karawila)', description: 'Fresh bitter gourd, excellent for stir fry and health.', price: 95, image: 'https://images.unsplash.com/photo-1617207765416-0a75a8e0bd79?w=400', category: categoryMap['vegetables'], stock: 100, unit: 'kg', isFeatured: false, rating: 4.3, reviewCount: 67, tags: ['healthy', 'fresh'] },
  { name: 'Drumstick (Murunga)', description: 'Murunga leaves and pods. Superfood used in daily cooking.', price: 60, image: 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=400', category: categoryMap['vegetables'], stock: 120, unit: 'bunch', isFeatured: true, rating: 4.8, reviewCount: 201, tags: ['superfood', 'local', 'organic'] },
  { name: 'Red Onions', description: 'Locally grown Sri Lankan red onions. Essential for every dish.', price: 180, image: 'https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=400', category: categoryMap['vegetables'], stock: 300, unit: 'kg', isFeatured: false, rating: 4.6, reviewCount: 312, tags: ['essential', 'local'] },
  { name: 'Green Chilli', description: 'Fresh hot green chillies. Essential Sri Lankan spice.', price: 75, image: 'https://images.unsplash.com/photo-1518622358385-8ea7d0794bf6?w=400', category: categoryMap['vegetables'], stock: 200, unit: '250g', isFeatured: false, rating: 4.4, reviewCount: 155, tags: ['spicy', 'fresh'] },

  // Fruits
  { name: 'King Coconut (Thambili)', description: 'Fresh Ceylon king coconut. Nature\'s best hydration drink.', price: 80, image: 'https://images.unsplash.com/photo-1546961342-ea5f62d3a27b?w=400', category: categoryMap['fruits'], stock: 100, unit: 'piece', isFeatured: true, rating: 4.9, reviewCount: 445, tags: ['fresh', 'local', 'hydration'] },
  { name: 'Wood Apple (Divul)', description: 'Ripe Ceylon wood apple. Makes excellent juice and preserve.', price: 45, image: 'https://images.unsplash.com/photo-1560353977-29a82b6dd8e9?w=400', category: categoryMap['fruits'], stock: 80, unit: 'piece', isFeatured: true, rating: 4.6, reviewCount: 188, tags: ['tropical', 'local'] },
  { name: 'Rambutan', description: 'Sweet and juicy rambutans. Fresh from the estate.', price: 250, image: 'https://images.unsplash.com/photo-1575218823251-f9f382f88b73?w=400', category: categoryMap['fruits'], stock: 60, unit: 'kg', isFeatured: false, rating: 4.7, reviewCount: 223, tags: ['exotic', 'sweet'] },
  { name: 'Ceylon Mango', description: 'Sweet Karthakolomban mangoes. Season\'s best.', price: 380, image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400', category: categoryMap['fruits'], stock: 50, unit: 'kg', isFeatured: true, rating: 4.9, reviewCount: 567, tags: ['seasonal', 'sweet', 'local'] },
  { name: 'Banana (Ambul)', description: 'Local Ambul bananas. Sweet and aromatic.', price: 120, image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400', category: categoryMap['fruits'], stock: 150, unit: 'bunch', isFeatured: false, rating: 4.5, reviewCount: 334, tags: ['local', 'sweet'] },

  // Cakes & Sweets
  { name: 'Love Cake', description: 'Traditional Sri Lankan Love Cake made with cashews, semolina and rose water.', price: 1200, originalPrice: 1400, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400', category: categoryMap['cakes'], stock: 20, unit: '500g', isFeatured: true, rating: 4.8, reviewCount: 389, tags: ['traditional', 'festive', 'gift'] },
  { name: 'Kokis', description: 'Crispy deep-fried Sri Lankan Kokis. Perfect festive snack.', price: 350, image: 'https://images.unsplash.com/photo-1586040140378-b8ced92e04a3?w=400', category: categoryMap['cakes'], stock: 50, unit: '250g', isFeatured: false, rating: 4.7, reviewCount: 276, tags: ['festive', 'traditional', 'crispy'] },
  { name: 'Kavum', description: 'Oil cakes made from rice flour and treacle. Traditional Avurudu sweet.', price: 280, image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400', category: categoryMap['cakes'], stock: 40, unit: '200g', isFeatured: false, rating: 4.6, reviewCount: 198, tags: ['traditional', 'avurudu', 'sweet'] },
  { name: 'Chocolate Cake', description: 'Rich Sri Lankan style chocolate cake with coconut milk frosting.', price: 1800, originalPrice: 2200, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', category: categoryMap['cakes'], stock: 15, unit: '1kg', isFeatured: true, rating: 4.9, reviewCount: 512, tags: ['celebration', 'chocolate', 'birthday'] },

  // Biscuits & Snacks
  { name: 'Munchee Cream Crackers', description: 'Classic Munchee cream crackers. Perfect with butter and jam.', price: 125, image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400', category: categoryMap['biscuits'], stock: 200, unit: 'pack', isFeatured: false, rating: 4.4, reviewCount: 678, tags: ['classic', 'tea-time'] },
  { name: 'Peanut Brittle (Kadala Toffee)', description: 'Crunchy traditional peanut brittle made with jaggery.', price: 95, image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400', category: categoryMap['biscuits'], stock: 100, unit: '150g', isFeatured: true, rating: 4.7, reviewCount: 334, tags: ['traditional', 'crunchy', 'local'] },
  { name: 'Murukku', description: 'Crispy savory spiral snack. Perfect evening snack with tea.', price: 110, image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?w=400', category: categoryMap['biscuits'], stock: 80, unit: '200g', isFeatured: false, rating: 4.5, reviewCount: 245, tags: ['savory', 'crispy', 'snack'] },

  // Dairy & Eggs
  { name: 'Farm Fresh Eggs', description: 'Free-range eggs from local Sri Lankan farms. Rich yolk.', price: 280, image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400', category: categoryMap['dairy'], stock: 500, unit: '10 pcs', isFeatured: true, rating: 4.8, reviewCount: 892, tags: ['farm-fresh', 'free-range'] },
  { name: 'Curd (Meekiri)', description: 'Traditional buffalo curd. Thick and creamy from Ambewela.', price: 350, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400', category: categoryMap['dairy'], stock: 60, unit: '500ml', isFeatured: true, rating: 4.9, reviewCount: 1034, tags: ['traditional', 'buffalo', 'ambewela'] },
  { name: 'Fresh Milk', description: 'Pure fresh cow\'s milk. Pasteurized and chilled.', price: 180, image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400', category: categoryMap['dairy'], stock: 100, unit: 'litre', isFeatured: false, rating: 4.6, reviewCount: 445, tags: ['fresh', 'pasteurized'] },

  // Spices
  { name: 'Ceylon Cinnamon', description: 'True Ceylon cinnamon sticks. World\'s finest cinnamon.', price: 420, originalPrice: 500, image: 'https://images.unsplash.com/photo-1565087534298-b9e9f5fe8a4e?w=400', category: categoryMap['spices'], stock: 150, unit: '100g', isFeatured: true, rating: 4.9, reviewCount: 1289, tags: ['premium', 'export-quality', 'ceylon'] },
  { name: 'Black Pepper', description: 'Sri Lankan whole black pepper. Strong and aromatic.', price: 380, image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', category: categoryMap['spices'], stock: 100, unit: '100g', isFeatured: false, rating: 4.7, reviewCount: 567, tags: ['whole', 'aromatic'] },
  { name: 'Turmeric Powder', description: 'Pure ground turmeric from Jaffna. Deep golden color.', price: 145, image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400', category: categoryMap['spices'], stock: 200, unit: '100g', isFeatured: false, rating: 4.6, reviewCount: 423, tags: ['jaffna', 'pure', 'golden'] },
  { name: 'Curry Leaf', description: 'Fresh curry leaves. Essential for authentic Sri Lankan cooking.', price: 30, image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400', category: categoryMap['spices'], stock: 300, unit: 'bunch', isFeatured: false, rating: 4.8, reviewCount: 1102, tags: ['essential', 'fresh', 'aromatic'] },

  // Rice & Grains
  { name: 'Samba Rice', description: 'Premium Sri Lankan Samba rice. Traditional staple grain.', price: 280, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', category: categoryMap['rice-grains'], stock: 500, unit: 'kg', isFeatured: true, rating: 4.8, reviewCount: 2341, tags: ['premium', 'traditional', 'samba'] },
  { name: 'Red Kekulu Rice', description: 'Nutritious red rice with high fiber. Traditional variety.', price: 320, image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400', category: categoryMap['rice-grains'], stock: 300, unit: 'kg', isFeatured: false, rating: 4.7, reviewCount: 876, tags: ['red-rice', 'nutritious', 'fiber'] },
  { name: 'Coconut Flour', description: 'Fresh ground coconut flour. Gluten-free and nutritious.', price: 195, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400', category: categoryMap['rice-grains'], stock: 150, unit: 'kg', isFeatured: false, rating: 4.5, reviewCount: 334, tags: ['gluten-free', 'coconut', 'flour'] },

  // Beverages
  { name: 'Ceylon Black Tea', description: 'Premium Orange Pekoe Ceylon tea from Nuwara Eliya highlands.', price: 580, originalPrice: 680, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400', category: categoryMap['beverages'], stock: 200, unit: '200g', isFeatured: true, rating: 4.9, reviewCount: 3456, tags: ['premium', 'highland', 'export-quality'] },
  { name: 'Coconut Water', description: 'Pure natural coconut water. Refreshing and hydrating.', price: 95, image: 'https://images.unsplash.com/photo-1541592553160-82008b127ccb?w=400', category: categoryMap['beverages'], stock: 150, unit: '330ml', isFeatured: false, rating: 4.7, reviewCount: 892, tags: ['natural', 'refreshing', 'hydration'] },
  { name: 'Woodapple Cordial', description: 'Traditional Sri Lankan wood apple cordial concentrate.', price: 320, image: 'https://images.unsplash.com/photo-1601379327928-bedfaf9da2d0?w=400', category: categoryMap['beverages'], stock: 80, unit: '500ml', isFeatured: true, rating: 4.6, reviewCount: 445, tags: ['traditional', 'tropical', 'cordial'] },
  { name: 'Herbal Tea (Sera)', description: 'Lemongrass herbal tea. Soothing and aromatic.', price: 245, image: 'https://images.unsplash.com/photo-1598632640487-6ea4a442e7e1?w=400', category: categoryMap['beverages'], stock: 120, unit: '50 bags', isFeatured: false, rating: 4.8, reviewCount: 567, tags: ['herbal', 'lemongrass', 'organic'] }
];

const seed = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) throw new Error('MONGO_URI not defined');

    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin user
    await User.create({
      name: 'CeylonCart Admin',
      email: 'admin@ceyloncart.lk',
      password: 'Admin@123',
      role: 'admin'
    });

    // Create test user
    await User.create({
      name: 'Test User',
      email: 'user@ceyloncart.lk',
      password: 'User@123',
      role: 'user'
    });
    console.log('👤 Created users');

    // Create categories
    const createdCategories = await Category.insertMany(categories);
    const categoryMap: Record<string, mongoose.Types.ObjectId> = {};
    createdCategories.forEach(cat => {
      categoryMap[cat.slug] = cat._id as mongoose.Types.ObjectId;
    });
    console.log(`📦 Created ${createdCategories.length} categories`);

    // Create products
    const products = getProducts(categoryMap);
    await Product.insertMany(products);
    console.log(`🛒 Created ${products.length} products`);

    console.log('\n✅ Database seeded successfully!');
    console.log('📧 Admin: admin@ceyloncart.lk / Admin@123');
    console.log('📧 User:  user@ceyloncart.lk  / User@123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
};

seed();
