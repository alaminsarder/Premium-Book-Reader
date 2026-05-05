import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';
import { Book } from '../types';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const { addToCart } = useCart();
  
  // কনসোলে চেক করার জন্য যে ডাটা আসছে কি না
  console.log("Rendering book:", book.title, "Image URL:", book.coverImage);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100"
    >
      <Link to={`/book/${book.id}`} className="block relative aspect-[2/3] overflow-hidden bg-gray-200">
        <img
          src={book.coverImage}
          alt={book.title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://via.placeholder.com/300x450?text=No+Image";
            console.error("Image failed to load:", book.coverImage);
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
      </Link>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider bg-amber-50 px-2 py-1 rounded">
            {book.category}
          </span>
          <div className="flex items-center text-yellow-500">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-xs font-bold text-gray-700 ml-1">{book.rating || 0}</span>
          </div>
        </div>

        <Link to={`/book/${book.id}`}>
          <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1 hover:text-amber-600 transition-colors">
            {book.title}
          </h3>
        </Link>
        <p className="text-gray-500 text-sm mb-4">{book.author}</p>

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">${book.price ? book.price.toFixed(2) : "0.00"}</span>
          <button
            onClick={() => addToCart(book)}
            className="bg-amber-600 text-white p-2 rounded-lg hover:bg-amber-700 transition-colors shadow-md hover:shadow-lg active:scale-95"
            aria-label="Add to cart"
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default BookCard;