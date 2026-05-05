import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { db } from '../firebase'; // আপনার firebase.ts ফাইল
import { collection, addDoc } from 'firebase/firestore'; // Firestore ফাংশন

const Checkout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const plan = location.state?.plan;

  const [formData, setFormData] = useState({ 
    name: '', 
    phone: '', 
    address: '', 
    courierAddress: '', 
    transactionId: '' 
  });
  
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    // ভ্যালিডেশন
    if (!formData.name || !formData.phone || !formData.address || !paymentMethod || !formData.transactionId) {
      alert("দয়া করে সব তথ্য এবং ট্রানজেকশন আইডি প্রদান করুন।");
      return;
    }
    
    setIsProcessing(true);

    try {
      // Firebase এ ডাটা সেভ করছি
      await addDoc(collection(db, "orders"), {
        customerName: formData.name,
        phone: formData.phone,
        address: formData.address,
        courierAddress: formData.courierAddress,
        transactionId: formData.transactionId,
        paymentMethod: paymentMethod,
        planTitle: plan.title,
        price: plan.initialPrice,
        createdAt: new Date().toISOString()
      });

      setIsProcessing(false);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Firebase Error: ", error); 
      alert("অর্ডার সাবমিট করতে সমস্যা হয়েছে! ফায়ারবেস কনসোল চেক করুন।");
      setIsProcessing(false);
    }
  };

  if (!plan) return <div className="p-10 text-center">কোনো প্ল্যান পাওয়া যায়নি। দয়া করে মেম্বারশিপ পেজে ফিরে যান।</div>;

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-lg text-center border">
          <h2 className="text-2xl font-bold text-green-600 mb-4">অর্ডার সম্পন্ন হয়েছে!</h2>
          <p>আপনার পেমেন্ট রিসিভ হয়েছে। আমরা ২-৪ ঘণ্টার মধ্যে আপনার অর্ডারটি ভেরিফাই করে কনফার্ম করব।</p>
          <button onClick={() => navigate('/')} className="mt-6 bg-gray-900 text-white px-6 py-2 rounded-xl">হোম পেজে ফিরুন</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-sm border">
        <h2 className="text-2xl font-bold mb-6">Payment: {plan.title} ({plan.initialPrice}৳)</h2>
        
        {/* তথ্য সংগ্রহ */}
        <div className="space-y-4 mb-8">
          <input type="text" name="name" onChange={handleInputChange} placeholder="আপনার নাম" className="w-full p-3 border rounded-xl" />
          <input type="tel" name="phone" onChange={handleInputChange} placeholder="ফোন নম্বর" className="w-full p-3 border rounded-xl" />
          <textarea name="address" onChange={handleInputChange} placeholder="আপনার পূর্ণ ঠিকানা" rows={2} className="w-full p-3 border rounded-xl"></textarea>
          <textarea name="courierAddress" onChange={handleInputChange} placeholder="সুন্দরবন কুরিয়ার ঠিকানা (শাখার নাম ও জেলা)" rows={2} className="w-full p-3 border rounded-xl"></textarea>
        </div>

        {/* পেমেন্ট মেথড */}
        <div className="mb-6">
          <p className="font-bold mb-2">পেমেন্ট মেথড সিলেক্ট করুন:</p>
          <div className="grid grid-cols-3 gap-3">
            {['bKash', 'Nagad', 'Rocket'].map((m) => (
              <button key={m} onClick={() => setPaymentMethod(m)} className={`p-3 rounded-xl border ${paymentMethod === m ? 'bg-gray-900 text-white' : 'bg-gray-100'}`}>
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* পেমেন্ট ইন্সট্রাকশন */}
        {paymentMethod && (
          <div className="bg-amber-50 p-4 rounded-xl mb-6 border border-amber-200">
            <p className="text-sm font-bold text-amber-800">আমাদের {paymentMethod} নাম্বার: 01704629926</p>
            <p className="text-xs text-amber-700 mt-1">এই নাম্বারে সেন্ড মানি করে ট্রানজেকশন আইডি নিচে লিখুন:</p>
            <input type="text" name="transactionId" onChange={handleInputChange} placeholder="Transaction ID লিখুন" className="w-full mt-2 p-3 border rounded-lg" />
          </div>
        )}

        <button 
          onClick={handleSubmit}
          disabled={isProcessing}
          className={`w-full py-4 rounded-xl font-bold text-lg ${isProcessing ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} text-white`}
        >
          {isProcessing ? 'Processing...' : 'Submit Order'}
        </button>
      </div>
    </div>
  );
};
export default Checkout;