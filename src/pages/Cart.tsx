import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <div className="bg-indigo-50 h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="h-12 w-12 text-indigo-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Looks like you haven't added any books to your cart yet. Start exploring our collection!
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transition-colors shadow-lg"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart ({totalItems})</h1>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Cart Items */}
          <div className="flex-grow space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-6"
              >
                <div className="w-24 h-36 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-grow text-center sm:text-left">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-gray-500 text-sm mb-4">{item.author}</p>
                  <div className="flex items-center justify-center sm:justify-start space-x-4">
                    <div className="flex items-center bg-gray-100 rounded-lg p-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-white rounded-md transition-colors disabled:opacity-50"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-white rounded-md transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="text-right flex flex-col items-center sm:items-end">
                  <span className="text-xl font-bold text-gray-900">{(item.price * item.quantity).toFixed(2)}৳</span>
                  <span className="text-sm text-gray-500">{item.price.toFixed(2)}৳ each</span>
                </div>
              </div>
            ))}

            <Link to="/" className="inline-flex items-center text-indigo-600 font-medium hover:underline">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
            </Link>
          </div>

          {/* Order Summary */}
          <aside className="lg:w-96">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{totalPrice.toFixed(2)}৳</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="border-t border-gray-100 pt-4 flex justify-between">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-indigo-600">{totalPrice.toFixed(2)}৳</span>
                </div>
              </div>

              <Link 
                to="/checkout"
                className="w-full bg-amber-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-amber-700 transition-all shadow-lg active:scale-95 flex items-center justify-center"
              >
                Proceed to Checkout
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Cart;