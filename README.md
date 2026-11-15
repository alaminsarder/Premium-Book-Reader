<div align="center">

# 📚 Premium Book Reader

**A Bengali/English book store and monthly reading membership platform.**

[![Live Demo](https://img.shields.io/badge/Live-Demo-f59e0b?style=for-the-badge)](https://premium-book-reader.vercel.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

![React](https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646cff?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-ffca28?logo=firebase&logoColor=black)

[Live Demo](https://premium-book-reader.vercel.app/) · [Report a Bug](https://github.com/alaminsarder/Premium-Book-Reader/issues) · [Request a Feature](https://github.com/alaminsarder/Premium-Book-Reader/issues)

</div>

---

## Overview

Premium Book Reader lets visitors browse books, order them through a cart, or subscribe to a monthly reading plan. Orders are stored in Firebase Firestore, and payment is made manually through bKash, Nagad or Rocket and verified by the owner.

🔗 **Live:** [premium-book-reader.vercel.app](https://premium-book-reader.vercel.app/)

## Features

- **Book store** with cover, category, rating and prices in BDT (৳)
- **Cart** with quantity control, saved in `localStorage`
- **One-click ordering** with an "Order Now" button
- **Membership plans:** Golden Reader, Diamond Reader, Islamic Golden, Islamic Diamond
- **Unified checkout** for both book orders and plan orders
- **Validation** for Bangladeshi mobile numbers and payment details
- **Notice board** for member announcements
- **Resilient images:** a gradient cover is shown if a book image fails to load
- **Responsive** layout with smooth animations

## Tech Stack

| Area | Technology |
|---|---|
| Framework | React + TypeScript |
| Build tool | Vite 5 |
| Styling | Tailwind CSS 3 |
| Animation | Framer Motion |
| Icons | Lucide React |
| Routing | React Router |
| Database | Firebase Firestore |

## Getting Started

**Requirements:** [Node.js](https://nodejs.org) 18+ and npm.

```bash
git clone https://github.com/alaminsarder/Premium-Book-Reader.git
cd Premium-Book-Reader
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

### Other commands

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |

## Project Structure

```
src/
├── components/   BookCard, BookCover, Navbar, Footer, PageHero, ErrorBoundary
├── context/      CartContext (cart state)
├── data/         books.ts, membership.ts, notices.ts
├── hooks/        useNotices
├── pages/        Home, Membership, BookDetails, Cart, Checkout, Notice
├── types/        Shared TypeScript types
├── utils/        bn.ts, cn.ts, format.ts
├── firebase.ts   Firebase configuration
├── App.tsx       Routes
└── main.tsx      Entry point (BrowserRouter + CartProvider)
```

## Routes

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

These rules let visitors create orders but not read, change or delete them. You can still see all orders in the Firebase Console.

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

## License

Distributed under the **MIT License**. See [LICENSE](LICENSE) for details.

## Author

**Al Amin Sarder** · [@alaminsarder](https://github.com/alaminsarder)
