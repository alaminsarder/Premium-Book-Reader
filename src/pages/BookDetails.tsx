import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingCart, ArrowLeft, ShieldCheck, Truck, RefreshCcw, Heart } from 'lucide-react';
import { books } from '../data/books';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';

const BookDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  
  const book = books.find(b => b.id === id);

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Book not found</h2>
          <Link to="/shop" className="text-indigo-600 hover:underline">Return to Shop</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/shop" className="inline-flex items-center text-gray-600 hover:text-amber-600 mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Shop
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          {/* Book Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-gray-100"
          >
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Book Info */}
          <div className="flex flex-col">
            <span className="text-amber-600 font-bold uppercase tracking-wider mb-2">{book.category}</span>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{book.title}</h1>
            <p className="text-xl text-gray-600 mb-6">by <span className="text-amber-600 font-medium">{book.author}</span></p>

            <div className="flex items-center space-x-6 mb-8">
              <div className="flex items-center text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-5 w-5 ${i < Math.floor(book.rating) ? 'fill-current' : 'text-gray-300'}`} />
                ))}
                <span className="ml-2 text-gray-700 font-bold">{book.rating}</span>
              </div>
              <span className="text-gray-400 border-l border-gray-300 pl-6">{book.reviews} Reviews</span>
              <span className="text-green-600 font-medium">In Stock ({book.stock})</span>
            </div>

            <p className="text-3xl font-bold text-gray-900 mb-8">${book.price.toFixed(2)}</p>

            <div className="prose prose-amber mb-10 text-gray-600 leading-relaxed">
              <p>{book.description}</p>
            </div>

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
              <button
                onClick={() => addToCart(book)}
                className="flex-grow bg-amber-600 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center hover:bg-amber-700 transition-all shadow-lg active:scale-95"
              >
                <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
              </button>
              <button className="bg-gray-100 text-gray-900 px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center hover:bg-gray-200 transition-all">
                <Heart className="mr-2 h-5 w-5" /> Wishlist
              </button>
            </div>

            {/* Value Props */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-gray-100">
              <div className="flex items-center space-x-3">
                <Truck className="h-6 w-6 text-amber-600" />
                <span className="text-sm font-medium text-gray-700">Free Shipping</span>
              </div>
              <div className="flex items-center space-x-3">
                <ShieldCheck className="h-6 w-6 text-amber-600" />
                <span className="text-sm font-medium text-gray-700">Secure Checkout</span>
              </div>
              <div className="flex items-center space-x-3">
                <RefreshCcw className="h-6 w-6 text-amber-600" />
                <span className="text-sm font-medium text-gray-700">Free Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Books Section (Simplified) */}
        <div className="mt-24">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">You might also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {books
              .filter(b => b.category === book.category && b.id !== book.id)
              .slice(0, 4)
              .map(b => (
                <div key={b.id} className="group">
                  <Link to={`/book/${b.id}`}>
                    <div className="aspect-[2/3] rounded-lg overflow-hidden mb-4 shadow-sm group-hover:shadow-md transition-shadow">
                      <img src={b.coverImage} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <h4 className="font-bold text-gray-900 group-hover:text-amber-600 transition-colors line-clamp-1">{b.title}</h4>
                    <p className="text-sm text-gray-500">${b.price.toFixed(2)}</p>
                  </Link>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
