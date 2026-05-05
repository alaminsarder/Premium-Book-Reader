import React from 'react';
import { Bell, Info } from 'lucide-react';

const Notice: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-900">Notice Board</h1>
        
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-8 text-amber-600">
            <Bell className="h-8 w-8" />
            <h2 className="text-2xl font-bold">বিশেষ বিজ্ঞপ্তি</h2>
          </div>
          
          <div className="space-y-6 text-gray-700 text-lg">
            <p>• মাসিক ফি এবং কুরিয়ার চার্জ প্রতি মাসের <strong>১০ তারিখের মধ্যে</strong> পরিশোধ করিতে হইবে।</p>
            <p>• পরপর যদি দুই মাসের টাকা বকেয়া থাকে তবে তার রেজিষ্ট্রেশন বাতিল হিসেবে গণ্য হবে।</p>
            <p>• ২০-১০-২০২৩ তারিখ থেকে ইসলামিক পাঠকদের জন্য গোল্ডেন ও ডায়মন্ড রিডার সার্ভিসটি চালু হয়েছে।</p>
            <p>• পোস্টে উল্লেখিত সকল নিয়মকানুন ইসলামিক রিডারদের জন্যও প্রযোজ্য।</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notice;