# 🥥 CeylonCart — Sri Lankan Shopping Cart Application

A full-stack Sri Lankan online grocery & food shopping application built with React, TypeScript, Node.js, Express, and MongoDB Atlas.

---

## 📁 Project Structure

```
ceylon-cart/
├── frontend/          # React + TypeScript + Tailwind CSS
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── types/
│   │   └── utils/
│   └── package.json
├── backend/           # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── middleware/
│   └── package.json
└── README.md
```

---

## ⚙️ STEP-BY-STEP SETUP GUIDE

### PREREQUISITES — Install These First

1. **Node.js** (v18+): https://nodejs.org/
2. **Git**: https://git-scm.com/
3. **VS Code**: https://code.visualstudio.com/
4. **MongoDB Atlas account** (free): https://www.mongodb.com/atlas

---


### STEP 2 — Copy Project Files

Copy all the provided files into the `ceylon-cart` folder maintaining the structure shown above.

---

### STEP 3 — Set Up MongoDB Atlas

1. Go to https://www.mongodb.com/atlas → **Sign up free**
2. Create a **Free Cluster** (M0 Sandbox)
3. Under **Security → Database Access**: Add a user with username/password
4. Under **Security → Network Access**: Click **"Add IP Address"** → **"Allow Access from Anywhere"**
5. Click **Connect** → **Connect your application** → Copy the connection string
   - It looks like: `mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/`

---

### STEP 4 — Backend Setup

```bash
# Seed the database with sample Sri Lankan products
npm run seed

# Start backend development server
npm run dev
```

Backend runs on: http://localhost:5000

---

### STEP 5 — Frontend Setup

`.env` should contain:
```
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev
```

Frontend runs on: http://localhost:5173

---

### STEP 6 — Test the Application

Open http://localhost:5173

**Admin credentials** (created by seed script):
- Email: `admin@ceyloncart.lk`
- Password: `Admin@123`

**Test user credentials**:
- Email: `user@ceyloncart.lk`
- Password: `User@123`

---

## 🚀 Features

### User Panel
- ✅ Browse products by category (Vegetables, Fruits, Cakes, Biscuits, Dairy, Spices, Rice & Grains, Beverages)
- ✅ Search products
- ✅ Add to cart / Edit quantities / Remove items
- ✅ Dynamic price calculation
- ✅ User registration & login (JWT auth)
- ✅ Order summary / Checkout
- ✅ Dark/Light mode toggle
- ✅ Responsive mobile design

### Admin Panel
- ✅ Dashboard with stats
- ✅ Add / Edit / Delete products
- ✅ Manage categories
- ✅ View all orders
- ✅ Manage users

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript |
| Styling | Tailwind CSS |
| State | React Context API |
| Backend | Node.js + Express + TypeScript |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT + bcrypt |
| Build | Vite (frontend) + ts-node (backend) |
