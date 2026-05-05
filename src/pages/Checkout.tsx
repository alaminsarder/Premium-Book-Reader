import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

const Checkout: React.FC = () => {
  const { cart, totalPrice } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('bKash');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleConfirmPayment = () => {
    if (!formData.name || !formData.phone || !formData.address) {
      alert("দয়া করে আপনার নাম, ফোন নম্বর এবং ঠিকানা পূরণ করুন।");
      return;
    }
    alert(`ধন্যবাদ ${formData.name}! আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে।`);
    // এখানে চাইলে আপনি কার্ট ক্লিয়ার করার ফাংশন যোগ করতে পারেন
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* বাম পাশ: ফরম সেকশন */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold mb-6">Delivery Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input type="text" name="name" onChange={handleInputChange} className="w-full mt-1 p-3 border rounded-xl" placeholder="আপনার নাম লিখুন" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input type="tel" name="phone" onChange={handleInputChange} className="w-full mt-1 p-3 border rounded-xl" placeholder="আপনার ফোন নম্বর" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Delivery Address</label>
              <textarea name="address" onChange={handleInputChange} className="w-full mt-1 p-3 border rounded-xl" placeholder="আপনার পূর্ণ ঠিকানা" rows={3}></textarea>
            </div>
          </div>

          <h3 className="text-lg font-bold mt-8 mb-4">Payment Method</h3>
          <div className="space-y-3">
            {['bKash', 'Nagad', 'Rocket'].map((method) => (
              <label key={method} className="flex items-center p-4 border rounded-xl cursor-pointer hover:bg-gray-50">
                <input type="radio" name="payment" value={method} checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} className="mr-3" />
                <span>{method}</span>
              </label>
            ))}
          </div>
        </div>

        {/* ডান পাশ: অর্ডার সামারি */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-fit">
          <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
          <div className="space-y-4 mb-6">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.title} (x{item.quantity})</span>
                <span className="font-bold">{(item.price * item.quantity).toFixed(2)}৳</span>
              </div>
            ))}
          </div>
          
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-amber-600">{totalPrice.toFixed(2)}৳</span>
            </div>
          </div>

          <button 
            onClick={handleConfirmPayment}
            className="w-full bg-green-600 text-white py-4 rounded-xl mt-8 font-bold text-lg hover:bg-green-700 transition"
          >
            Confirm Payment
          </button>
        </div>
      </div>
    </div>
  );
};
export default Checkout;