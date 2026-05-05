import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, BookOpen } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-amber-600" />
            <span className="text-2xl font-bold text-gray-900 tracking-tight">Premium Book Reader</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            <Link to="/" className="text-gray-600 hover:text-amber-600 font-medium transition">Home</Link>
            <Link to="/membership" className="text-gray-600 hover:text-amber-600 font-medium transition">Membership</Link>
            <Link to="/notice" className="text-gray-600 hover:text-amber-600 font-medium transition">Notice</Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4 space-y-4">
          <Link to="/" onClick={() => setIsOpen(false)} className="block text-gray-600 font-medium">Home</Link>
          <Link to="/membership" onClick={() => setIsOpen(false)} className="block text-gray-600 font-medium">Membership</Link>
          <Link to="/notice" onClick={() => setIsOpen(false)} className="block text-gray-600 font-medium">Notice</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;