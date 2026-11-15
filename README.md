# 📚 Premium Book Reader

A Bengali/English premium book store and membership website. Visitors can browse books, add them to a cart, order books, and subscribe to monthly reading plans (Golden Reader, Diamond Reader, Islamic Golden, Islamic Diamond). Orders are saved to Firebase Firestore and paid manually via bKash, Nagad or Rocket.

## ✨ Features

- **Premium home page**: hero section, popular books, membership plans, benefits and call-to-action
- **Book store**: book cards with cover, category, rating, price in BDT (৳)
- **Cart**: add to cart, change quantity, remove items, clear cart (saved in the browser's localStorage)
- **Order Now**: one click adds the book and opens checkout
- **Checkout for both book orders and membership plans**
  - Bangladeshi phone number validation
  - bKash / Nagad / Rocket payment with transaction ID
  - Order saved to Firestore with a reference number
- **Membership plans**: 4 plans with registration fee, monthly fee and courier fee
- **Notice page**: announcements for members
- **Cover fallback**: if a book image fails to load, a gradient cover with the title is shown
- **Responsive design** with smooth animations

## 🛠 Tech Stack

| Area | Technology |
|---|---|
| Framework | React + TypeScript |
| Build tool | Vite 5 |
| Styling | Tailwind CSS v3 |
| Animation | framer-motion |
| Icons | lucide-react |
| Routing | react-router-dom |
| Database | Firebase Firestore |

## 🚀 Getting Started

### Requirements

- [Node.js](https://nodejs.org) 18 or newer
- npm (comes with Node.js)

### Install and run

```bash
git clone https://github.com/alaminsarder/Premium-Book-Reader.git
cd Premium-Book-Reader
npm install
npm run dev
```

Open the address shown in the terminal (usually http://localhost:5173).

### Other commands

```bash
npm run build     # create the production build in /dist
npm run preview   # preview the production build locally
```

## 📁 Project Structure

```
src/
├── components/
│   ├── BookCard.tsx        # Book card with Add / Order Now buttons
│   ├── BookCover.tsx       # Cover image with gradient fallback
│   ├── ErrorBoundary.tsx   # Shows errors on screen instead of a white page
│   ├── Footer.tsx
│   ├── Navbar.tsx          # Links + cart icon with item count
│   └── PageHero.tsx
├── context/
│   └── CartContext.tsx     # Cart state (add, remove, quantity, total)
├── data/
│   ├── books.ts            # Book list (edit your books here)
│   ├── membership.ts       # Plans, prices, payment number, FAQ
│   └── notices.ts          # Notice page content
├── hooks/
│   └── useNotices.ts
├── pages/
│   ├── Home.tsx
│   ├── Membership.tsx
│   ├── BookDetails.tsx
│   ├── Cart.tsx
│   ├── Checkout.tsx        # Handles BOTH cart orders and plan orders
│   └── Notice.tsx
├── types/index.ts          # Book type
├── utils/
│   ├── bn.ts               # Bengali digits and Taka formatting
│   ├── cn.ts               # className helper
│   └── format.ts           # formatBDT()
├── firebase.ts             # Firebase setup
├── App.tsx                 # Routes
├── main.tsx                # Entry: BrowserRouter + CartProvider
└── index.css               # Tailwind + global styles
```

### Routes

| Path | Page |
|---|---|
| `/` | Home |
| `/membership` | Membership plans |
| `/book/:id` | Book details |
| `/cart` | Cart |
| `/checkout` | Checkout (book order or plan order) |
| `/notice` | Notices |
| `*` | Redirects to `/` |

> **Important:** `BrowserRouter` and `CartProvider` must exist **only once**, in `main.tsx`. Adding them again in `App.tsx` causes the "You cannot render a Router inside another Router" white-screen error.

## 🔥 Firebase Setup

1. Go to the [Firebase Console](https://console.firebase.google.com) and open your project.
2. Open **Firestore** and create a database if you don't have one (choose a location close to Bangladesh, e.g. `asia-south1`).
3. Open the **Rules** tab, paste the rules below and click **Publish**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /orders/{orderId} {
      allow create: if true;
      allow read, update, delete: if false;
    }
  }
}
```

These rules let visitors **create** orders but not read, change or delete them. You can still see all orders in the Firebase Console.

4. Put your own Firebase config in `src/firebase.ts`.

> If you create the database in "test mode", the default rules expire after 30 days and new orders fail with `permission-denied`. Always publish the rules above.

### Order data

Every order is saved in the `orders` collection.

**Book order** (`type: "book"`):

```
customerName, phone, address, courierAddress,
transactionId, paymentMethod, status: "pending", createdAt,
type: "book",
items: [{ id, title, price, quantity }],
subtotal, deliveryFee, price (total)
```

**Membership order** (`type: "membership"`):

```
customerName, phone, address, courierAddress,
transactionId, paymentMethod, status: "pending", createdAt,
type: "membership",
planId, planTitle, price
```

Older plan orders created before the update have no `type` field. They are all plan orders.

## ✏️ How to Customize

### Add or edit books: `src/data/books.ts`

Copy one book block and change the values:

```ts
{
  id: '9',
  title: 'Book Title',
  author: 'Author Name',
  price: 500,                       // in BDT
  category: 'Fiction',
  description: 'Short description',
  coverImage: '/covers/my-book.jpg',
  rating: 4.5,
  reviews: 100,
  stock: 10,
  featured: false,
}
```

The Home page shows the first 8 books (`books.slice(0, 8)`).

### Book cover images

- **Best option:** put your own images in `public/covers/` and use `coverImage: '/covers/my-book.jpg'`
- Or use a full image URL (`https://...`)
- If an image is missing or broken, a gradient cover with the book title is shown automatically

### Change plans and prices: `src/data/membership.ts`

- `PLANS`: each plan has `regFee` (one-time) and `monthlyFee`
- `COURIER_FEE`: monthly courier charge (also used as the book delivery fee)
- `PAYMENT_NUMBER`: the bKash/Nagad/Rocket number shown at checkout
- `FAQ` and `BENEFITS`: text shown on the Membership page

### Book delivery fee: `src/pages/Checkout.tsx`

```ts
const BOOK_DELIVERY_FEE = COURIER_FEE; // use 0 for free delivery
```

## 🧾 How Ordering Works

**Book order**

1. Click **Add** (or **Order Now**) on a book
2. Open the cart from the navbar, then click **অর্ডার করুন**
3. Fill in name, phone, address, choose bKash/Nagad/Rocket, send money, enter the transaction ID
4. Submit: the order is saved and the cart is cleared

**Plan order**

1. Open Membership (or the plans on Home) and click a plan's order button
2. The plan is passed to `/checkout` through router state: `state={{ plan: toCheckoutPlan(p) }}`
3. Fill in the form and submit

After an order, the owner checks the transaction in the bKash/Nagad/Rocket account, then confirms the order manually (usually within 2-4 hours).

## 🌐 Deployment

Build the project and upload the `dist` folder to any static host (Vercel, Netlify, Firebase Hosting).

```bash
npm run build
```

Because the app uses client-side routing, configure a fallback so every path serves `index.html`. On Netlify, add `public/_redirects` with:

```
/*  /index.html  200
```

On Vercel, add `vercel.json`:

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

## 🩺 Troubleshooting

| Problem | Fix |
|---|---|
| `'vite' is not recognized` | Run `npm install` first |
| White screen, "Router inside another Router" | Keep `BrowserRouter` and `CartProvider` only in `main.tsx` |
| Orders fail with `permission-denied` | Publish the Firestore rules above |
| Checkout says "nothing to order" | The cart is empty, or the plan button doesn't pass `state` |
| Book shows a gradient instead of a picture | The link is broken, or the code uses `book.image` instead of `book.coverImage` |
| Styles missing | This project uses Tailwind **v3**. `index.css` must start with `@tailwind base; @tailwind components; @tailwind utilities;` |

## 📌 Notes

- Firebase web API keys are not secret, but keep the Firestore rules in place. Use a **Private** repo if you prefer.
- Cart data is stored in the browser (`localStorage`, key `app_cart_v1`).
- Payment is manual: the app does not process payments automatically.

## 👤 Author

**Al Amin Sarder**: [github.com/alaminsarder](https://github.com/alaminsarder)

## 📄 License

This project is for personal/commercial use by the owner. Add a license file if you want to share it publicly.
