import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Crown,
  Gem,
  BookOpen,
  BadgePercent,
  Package,
  Truck,
  Sparkles,
  CreditCard,
  ShieldCheck,
  ArrowRight,
  Star,
  Users,
  BookMarked,
  ChevronRight,
} from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import BookCard from '../components/BookCard';
import { books } from '../data/books';

/* ──────────────────────────────────────────────
 *  Data
 * ────────────────────────────────────────────── */

const membershipPlans = [
  {
    id: 'golden',
    title: 'Golden Reader',
    price: 250,
    icon: <Crown className="h-8 w-8" />,
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    border: 'from-amber-300/60 via-amber-100/20 to-amber-300/60',
    popular: false,
  },
  {
    id: 'diamond',
    title: 'Diamond Reader',
    price: 400,
    icon: <Gem className="h-8 w-8" />,
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    border: 'from-blue-400/60 via-indigo-200/20 to-blue-400/60',
    popular: true,
  },
  {
    id: 'islamic-golden',
    title: 'Islamic Golden',
    price: 400,
    icon: <Crown className="h-8 w-8" />,
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    border: 'from-emerald-300/60 via-emerald-100/20 to-emerald-300/60',
    popular: false,
  },
  {
    id: 'islamic-diamond',
    title: 'Islamic Diamond',
    price: 500,
    icon: <Gem className="h-8 w-8" />,
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'from-emerald-400/60 via-green-200/20 to-emerald-400/60',
    popular: false,
  },
];

const benefits = [
  { icon: BookOpen, text: 'নিয়মিত বই কেনার ঝামেলা থেকে মুক্ত থাকার দারুণ সুযোগ' },
  { icon: BadgePercent, text: 'বাইরে থেকে কিনলে যেটা বেশি খরচ হয়, সেটি অনেক কমে পাওয়া যায়' },
  { icon: Package, text: 'মাসিক বইয়ের সাথে যেকোনো এক্সট্রা বই অর্ডার করা যাবে' },
  { icon: Truck, text: 'এক্সট্রা বইয়ের জন্য কোনো কুরিয়ার চার্জ লাগবে না' },
  { icon: Sparkles, text: 'নিয়মিত নতুন ও প্রিমিয়াম বই পড়ার সুযোগ' },
  { icon: CreditCard, text: '১ বছর ধারাবাহিক মেম্বার হলে স্পেশাল Green Card পাওয়া যাবে' },
  { icon: ShieldCheck, text: 'Green Card থাকলে থাকবে এক্সক্লুসিভ সুবিধা ও প্রিভিলেজ' },
];

const stats = [
  { icon: Users, value: '10K+', label: 'Active Members' },
  { icon: BookMarked, value: '50K+', label: 'Books Delivered' },
  { icon: Star, value: '4.9', label: 'Average Rating' },
];

/* ──────────────────────────────────────────────
 *  Animation Variants
 * ────────────────────────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.1,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

/* ──────────────────────────────────────────────
 *  Reusable Section Wrapper (scroll-triggered)
 * ────────────────────────────────────────────── */

const Section: React.FC<{
  children: React.ReactNode;
  className?: string;
  id?: string;
}> = ({ children, className = '', id }) => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.section
      ref={ref}
      id={id}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={staggerContainer}
      className={className}
    >
      {children}
    </motion.section>
  );
};

/* ──────────────────────────────────────────────
 *  Home Component
 * ────────────────────────────────────────────── */

const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 overflow-x-hidden">
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-slate-950">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=2000"
            className="w-full h-full object-cover opacity-40"
            alt="Library"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/60 to-slate-950" />
        </div>

        {/* Animated gradient orbs */}
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-20 -left-32 w-96 h-96 bg-amber-500/20 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 40, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-10 right-0 w-80 h-80 bg-emerald-500/15 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, 20, 0], y: [0, 20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]"
        />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-amber-300 text-sm font-medium mb-8"
            >
              <Sparkles className="h-4 w-4" />
              Premium Reading Experience
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight text-white mb-6"
            >
              Elevate Your{' '}
              <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                Premium
              </span>
              <br />
              Reading Journey
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-xl mb-10"
            >
              সত্যিকারের বইপ্রেমীদের জন্য আমাদের এক্সক্লুসিভ কালেকশন এবং
              মেম্বারশিপ সার্ভিস।
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                to="/membership"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 font-bold rounded-2xl shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300"
              >
                Explore Plans
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              {/* ✅ Scrolls to the books section on this page */}
              <a
                href="#books"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 backdrop-blur-md text-white font-semibold rounded-2xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
              >
                Browse Books
              </a>
            </motion.div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 to-transparent" />
      </section>

      {/* ═══════════════ STATS BAR ═══════════════ */}
      <Section className="relative -mt-16 z-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeUp}
          className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 grid grid-cols-3 divide-x divide-slate-100"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1">
              <stat.icon className="h-6 w-6 text-amber-500 mb-1" />
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {stat.value}
              </span>
              <span className="text-sm text-slate-500 font-medium">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </Section>

      {/* ═══════════════ BOOKS ═══════════════ */}
      <Section id="books" className="pt-24 px-4 sm:px-6 lg:px-8 scroll-mt-16">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeUp} className="mb-10">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              Popular Books
            </h2>
            <p className="mt-3 text-lg text-slate-500">
              আমাদের কালেকশন থেকে বাছাই করা বই
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {books.slice(0, 8).map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      </Section>

      {/* ═══════════════ MEMBERSHIP PLANS ═══════════════ */}
      <Section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeUp} className="text-center mb-16">
            <span className="inline-block px-4 py-1 rounded-full bg-amber-100 text-amber-700 text-sm font-semibold tracking-wide uppercase mb-4">
              Membership
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              Choose Your{' '}
              <span className="bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
                Reading Plan
              </span>
            </h2>
            <p className="mt-4 text-lg text-slate-500 max-w-xl mx-auto">
              আপনার পড়ার অভ্যাস অনুযায়ী সেরা প্ল্যানটি বেছে নিন
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {membershipPlans.map((plan, i) => (
              <motion.div key={plan.id} variants={fadeUp} custom={i}>
                <Link to="/membership" className="block group h-full">
                  {/* Gradient border wrapper */}
                  <div
                    className={`relative h-full p-[1.5px] rounded-3xl bg-gradient-to-br ${plan.border} transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-slate-200/60`}
                  >
                    {/* Popular badge */}
                    {plan.popular && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                        <span className="inline-flex items-center gap-1 px-4 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-bold rounded-full shadow-lg shadow-blue-500/30 uppercase tracking-wider">
                          <Star className="h-3 w-3 fill-current" />
                          Most Popular
                        </span>
                      </div>
                    )}

                    {/* Card body */}
                    <div className="relative h-full bg-white rounded-[22px] p-8 flex flex-col overflow-hidden">
                      {/* Hover shine */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-700 ease-in-out pointer-events-none" />

                      <div
                        className={`w-14 h-14 rounded-2xl ${plan.bg} flex items-center justify-center mb-6 ${plan.text} group-hover:scale-110 transition-transform duration-300`}
                      >
                        {plan.icon}
                      </div>

                      <h3 className="text-xl font-bold text-slate-900 mb-1">
                        {plan.title}
                      </h3>

                      <div className="mt-auto pt-6 border-t border-slate-100">
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-extrabold text-slate-900">
                            {plan.price}
                          </span>
                          <span className="text-slate-400 font-medium">৳ / month</span>
                        </div>
                        <div
                          className={`mt-4 inline-flex items-center gap-1 text-sm font-semibold ${plan.text} group-hover:gap-2 transition-all`}
                        >
                          Get Started
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══════════════ BENEFITS (dark) ═══════════════ */}
      <Section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-slate-950 overflow-hidden">
        {/* Background orbs */}
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px]" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div variants={fadeUp} className="text-center mb-16">
            <span className="inline-block px-4 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-semibold tracking-wide uppercase mb-4 border border-emerald-500/20">
              Benefits
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
              Why Join Our{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Membership?
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto">
            {benefits.map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i}
                className="group flex items-start gap-5 p-6 rounded-2xl bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] hover:bg-white/[0.08] hover:border-emerald-500/20 transition-all duration-300"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:from-emerald-500/30 transition-all duration-300">
                  <item.icon className="h-5 w-5" />
                </div>
                <p className="text-slate-300 text-lg leading-relaxed pt-1.5 group-hover:text-white transition-colors">
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══════════════ FINAL CTA ═══════════════ */}
      <Section className="py-24 px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeUp}
          className="max-w-4xl mx-auto relative rounded-[2rem] overflow-hidden"
        >
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.25),transparent_50%)]" />

          <div className="relative z-10 px-8 sm:px-16 py-16 text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
              আজই মেম্বারশিপ নিন
            </h2>
            <p className="text-slate-800/80 text-lg mb-8 max-w-lg mx-auto">
              হাজারো বইপ্রেমীদের সাথে যুক্ত হোন এবং প্রিমিয়াম রিডিং এক্সপেরিয়েন্স উপভোগ করুন।
            </p>
            <Link
              to="/membership"
              className="group inline-flex items-center gap-2 px-10 py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl shadow-slate-900/20 hover:bg-slate-800 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300"
            >
              Start Reading Today
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </Section>
    </div>
  );
};

export default Home;