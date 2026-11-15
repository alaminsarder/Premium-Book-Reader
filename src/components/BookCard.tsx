import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Star, Zap, Check } from 'lucide-react';
import { Book } from '../types';
import { useCart } from '../context/CartContext';
import { formatBDT } from '../utils/format';
import BookCover from './BookCover';

const BookCard: React.FC<{ book: Book }> = ({ book }) => {
  const { cart, addToCart } = useCart();
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart(book);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleOrderNow = () => {
    if (!cart.some((i) => i.id === book.id)) addToCart(book);
    navigate('/checkout');
  };

  return (
    <div className="group flex flex-col bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <Link to={`/book/${book.id}`} className="block aspect-[3/4] overflow-hidden">
        <BookCover
          src={book.coverImage}
          title={book.title}
          id={book.id}
          className="group-hover:scale-105 transition-transform duration-500"
        />
      </Link>

      <div className="flex flex-col flex-1 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-[11px] font-bold uppercase tracking-wide">
            {book.category}
          </span>
          <span className="flex items-center gap-1 text-xs font-bold text-slate-700">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            {book.rating}
          </span>
        </div>

        <Link to={`/book/${book.id}`}>
          <h3 className="font-bold text-slate-900 leading-snug line-clamp-2 hover:text-amber-700 transition-colors">
            {book.title}
          </h3>
        </Link>
        <p className="text-sm text-slate-500 mt-1">{book.author}</p>

        <div className="mt-auto pt-4">
          <div className="text-xl font-extrabold text-slate-900 mb-3">
            {formatBDT(book.price)}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleAdd}
              className={`inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-semibold border transition-all active:scale-95 ${
                added
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-white border-slate-200 text-slate-800 hover:border-amber-400 hover:text-amber-700'
              }`}
            >
              {added ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
              {added ? 'Added' : 'Add'}
            </button>

            <button
              type="button"
              onClick={handleOrderNow}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md shadow-amber-500/25 hover:shadow-amber-500/40 active:scale-95 transition-all"
            >
              <Zap className="h-4 w-4" />
              Order Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;