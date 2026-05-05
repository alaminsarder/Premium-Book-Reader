import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, Gem } from 'lucide-react';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
  const membershipPlans = [
    { id: 'golden', title: 'Golden Reader', price: 250, icon: <Crown className="h-12 w-12 text-amber-500" /> },
    { id: 'diamond', title: 'Diamond Reader', price: 400, icon: <Gem className="h-12 w-12 text-blue-500" /> },
    { id: 'islamic-golden', title: 'Islamic Golden', price: 400, icon: <Crown className="h-12 w-12 text-emerald-500" /> },
    { id: 'islamic-diamond', title: 'Islamic Diamond', price: 500, icon: <Gem className="h-12 w-12 text-emerald-600" /> }
  ];

  const benefits = [
    "📚 নিয়মিত বই কেনার ঝামেলা থেকে মুক্ত থাকার দারুণ সুযোগ",
    "💰 বাইরে থেকে কিনলে যেটা বেশি খরচ হয়, সেটি অনেক কমে পাওয়া যায়",
    "🚚 মাসিক বইয়ের সাথে যেকোনো এক্সট্রা বই অর্ডার করা যাবে",
    "🎁 এক্সট্রা বইয়ের জন্য কোনো কুরিয়ার চার্জ লাগবে না",
    "📖 নিয়মিত নতুন ও প্রিমিয়াম বই পড়ার সুযোগ",
    "🌟 ১ বছর ধারাবাহিক মেম্বার হলে স্পেশাল Green Card পাওয়া যাবে",
    "💎 Green Card থাকলে থাকবে এক্সক্লুসিভ সুবিধা ও প্রিভিলেজ"
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">

      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=2000"
            className="w-full h-full object-cover brightness-[0.7]"
            alt="Library"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Elevate Your <span className="text-amber-500">Premium</span> Reading
            </h1>
            <p className="text-xl text-gray-200">
              সত্যিকারের বইপ্রেমীদের জন্য আমাদের এক্সক্লুসিভ কালেকশন এবং মেম্বারশিপ সার্ভিস।
            </p>
          </motion.div>
        </div>
      </section>

      {/* Membership Plans */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">

          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
            Our Membership Plans
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {membershipPlans.map((plan) => (
              <Link to="/membership" key={plan.id} className="block group">
                <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 flex flex-col hover:shadow-2xl transition-all h-full hover:scale-105">
                  <div className="mb-6">{plan.icon}</div>
                  <h3 className="text-2xl font-bold mb-2 text-gray-900">{plan.title}</h3>
                  <div className="text-xl font-bold text-gray-700">{plan.price}৳ / month</div>
                </div>
              </Link>
            ))}
          </div>

          {/* ⭐ PREMIUM HIGHLIGHTED BENEFITS SECTION */}
          <div className="mt-20 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl p-10 border border-gray-100">

            <h3 className="text-3xl font-bold text-center mb-10 text-gray-900">
              Why Join Our Membership?
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {benefits.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-5 rounded-2xl bg-white shadow-sm border border-gray-100 hover:shadow-md hover:scale-[1.02] transition-all duration-300"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 font-bold">
                    ✓
                  </div>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {item}
                  </p>
                </div>
              ))}
            </div>

          </div>

        </div>
      </section>
    </div>
  );
};

export default Home;
