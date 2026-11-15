import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, BookOpen, ShoppingCart } from "lucide-react";
import { cn } from "../utils/cn";
import { useCart } from "../context/CartContext";

const LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/membership", label: "Membership", end: false },
  { to: "/notice", label: "Notice", end: false },
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { totalItems } = useCart();

  return (
    <nav className="sticky top-0 z-50 border-b border-ink-900/10 bg-white/85 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5" onClick={() => setIsOpen(false)}>
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-ink-900">
              <BookOpen className="h-5 w-5 text-amber-400" />
            </span>
            <span className="font-serif text-xl font-bold text-ink-900">Premium Book Reader</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden items-center gap-9 md:flex">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  cn(
                    "relative py-1 font-medium transition-colors",
                    isActive ? "text-ink-900" : "text-ink-600 hover:text-ink-900"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {l.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute -bottom-[1.2rem] left-0 right-0 h-0.5 bg-amber-500"
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-1">
            {/* Cart (always visible) */}
            <Link
              to="/cart"
              onClick={() => setIsOpen(false)}
              className="relative rounded-lg p-2 text-ink-700 hover:bg-ink-900/5"
              aria-label={`Cart, ${totalItems} items`}
            >
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-[1.25rem] place-items-center rounded-full bg-amber-500 px-1 text-xs font-bold text-ink-950">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </Link>

            {/* Mobile toggle */}
            <button
              type="button"
              onClick={() => setIsOpen((o) => !o)}
              className="rounded-lg p-2 text-ink-700 hover:bg-ink-900/5 md:hidden"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-ink-900/10 bg-white md:hidden"
          >
            <div className="space-y-1 px-4 py-3">
              {LINKS.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.end}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "block rounded-lg px-3 py-3 font-medium",
                      isActive ? "bg-amber-50 text-amber-800" : "text-ink-700 hover:bg-ink-900/5"
                    )
                  }
                >
                  {l.label}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;