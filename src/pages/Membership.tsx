import React from 'react';
import { Crown, Gem, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Membership: React.FC = () => {
  const navigate = useNavigate();

  const plans = [
    { 
      id: 'golden-reader', 
      title: 'গোল্ডেন রিডার', 
      initialPrice: 660, 
      recurringPrice: 310, 
      initialDetails: '৩৫০ (রেজিঃ) + ২৫০ (মাসিক) + ৬০ (কুরিয়ার)',
      recurringDetails: '২৫০ (মাসিক) + ৬০ (কুরিয়ার)',
      icon: <Crown className="h-10 w-10 text-amber-500" /> 
    },
    { 
      id: 'diamond-reader', 
      title: 'ডায়মন্ড রিডার', 
      initialPrice: 810, 
      recurringPrice: 460, 
      initialDetails: '৩৫০ (রেজিঃ) + ৪০০ (মাসিক) + ৬০ (কুরিয়ার)',
      recurringDetails: '৪০০ (মাসিক) + ৬০ (কুরিয়ার)',
      icon: <Gem className="h-10 w-10 text-blue-500" /> 
    },
    { 
      id: 'islamic-golden', 
      title: 'ইসলামিক গোল্ডেন', 
      initialPrice: 710, 
      recurringPrice: 460, 
      initialDetails: '২৫০ (রেজিঃ) + ৪০০ (মাসিক) + ৬০ (কুরিয়ার)',
      recurringDetails: '৪০০ (মাসিক) + ৬০ (কুরিয়ার)',
      icon: <Crown className="h-10 w-10 text-emerald-500" /> 
    },
    { 
      id: 'islamic-diamond', 
      title: 'ইসলামিক ডায়মন্ড', 
      initialPrice: 810, 
      recurringPrice: 560, 
      initialDetails: '২৫০ (রেজিঃ) + ৫০০ (মাসিক) + ৬০ (কুরিয়ার)',
      recurringDetails: '৫০০ (মাসিক) + ৬০ (কুরিয়ার)',
      icon: <Gem className="h-10 w-10 text-emerald-600" /> 
    }
  ];

  const handleSubscribe = (plan: any) => {
    // এখানে ক্লিক করলে সরাসরি পেমেন্ট বা চেকআউট পেজে ডাটা সহ নিয়ে যাবে
    navigate('/checkout', { state: { plan: plan } });
  };

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg: Spx-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">আমাদের মেম্বারশিপ প্ল্যান</h1>
          <p className="text-gray-600">আপনার পছন্দের প্ল্যানটি বেছে নিন এবং আজই মেম্বার হোন</p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {plans.map((plan) => (
            <div key={plan.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col transition-all hover:shadow-xl">
              <div className="mb-4">{plan.icon}</div>
              <h3 className="text-xl font-bold mb-6 text-gray-900">{plan.title}</h3>
              
              <div className="space-y-4 mb-8">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">প্রথমবার পেমেন্ট</p>
                  <p className="text-2xl font-bold text-gray-900">{plan.initialPrice}৳</p>
                  <p className="text-[11px] text-gray-400 mt-1">{plan.initialDetails}</p>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">পরবর্তী মাস থেকে</p>
                  <p className="text-xl font-bold text-gray-700">{plan.recurringPrice}৳</p>
                  <p className="text-[11px] text-emerald-600 bg-emerald-50 px-2 py-1 rounded inline-block mt-1">{plan.recurringDetails}</p>
                </div>
              </div>
              
              <button 
                onClick={() => handleSubscribe(plan)}
                className="mt-auto w-full bg-gray-900 hover:bg-black text-white py-3 rounded-xl font-bold transition-all shadow-md"
              >
                সাবস্ক্রাইব করুন
              </button>
            </div>
          ))}
        </div>

        {/* Rules Section */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-6 text-amber-600">
            <Info className="h-6 w-6" />
            <h2 className="text-2xl font-bold">নিয়মাবলী ও শর্তসমূহ</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4 text-gray-600 text-sm">
            <p>• মাসিক ফি এবং কুরিয়ার চার্জ প্রতি মাসের ১০ তারিখের মধ্যে পরিশোধ করিতে হইবে।</p>
            <p>• পরপর দুই মাস বকেয়া থাকলে রেজিষ্ট্রেশন বাতিল গণ্য হবে।</p>
            <p>• ইসলামিক রিডারদের জন্য গোল্ডেন ও ডায়মন্ড সার্ভিস চালু হয়েছে।</p>
            <p>• সকল নিয়মকানুন সকল রিডারদের জন্য সমানভাবে প্রযোজ্য।</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Membership;