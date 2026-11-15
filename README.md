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

<!--
## Screenshots

![Home](screenshots/home.png)
![Membership](screenshots/membership.png)
![Checkout](screenshots/checkout.png)

To show screenshots: put the images in a /screenshots folder,
then delete the "<!--" line above and the "-->" line below this block.
-->

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

## Membership Plans

| Plan | Registration (one-time) | Monthly | Courier | First payment | From next month |
|---|---|---|---|---|---|
| Golden Reader | ৳350 | ৳250 | ৳60 | **৳660** | ৳310 |
| Diamond Reader | ৳350 | ৳400 | ৳60 | **৳810** | ৳460 |
| Islamic Golden | ৳250 | ৳400 | ৳60 | **৳710** | ৳460 |
| Islamic Diamond | ৳250 | ৳500 | ৳60 | **৳810** | ৳560 |

## How It Works

1. **Choose:** add books to the cart, or pick a membership plan.
2. **Checkout:** enter name, phone and address.
3. **Pay:** send money by bKash, Nagad or Rocket and enter the transaction ID.
4. **Confirmation:** the order is saved, and the owner verifies the payment and confirms it within 2-4 hours.

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

The app runs at `http://localhost:5173`. Firebase is configured in `src/firebase.ts`.

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

## Roadmap

- [x] Book store with cart and one-click ordering
- [x] Membership plans and unified checkout
- [x] Firestore order storage
- [ ] Admin dashboard to view and confirm orders
- [ ] Order status tracking for customers
- [ ] Online payment gateway integration
- [ ] Book search and category filters
- [ ] Bengali / English language switch

## Contributing

Contributions are welcome.

1. Fork the repository
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push the branch: `git push origin feature/your-feature`
5. Open a Pull Request

For bugs and ideas, please [open an issue](https://github.com/alaminsarder/Premium-Book-Reader/issues).

## Contact

**Al Amin Sarder**
GitHub: [@alaminsarder](https://github.com/alaminsarder)

## License

Distributed under the **MIT License**. See [LICENSE](LICENSE) for details.

---

<div align="center">

If you like this project, please give it a ⭐

</div>
