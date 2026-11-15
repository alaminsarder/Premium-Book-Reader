import {
  BadgePercent,
  BookOpen,
  CreditCard,
  Package,
  ShieldCheck,
  Sparkles,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { toBn } from "../utils/bn";

export const COURIER_FEE = 60;
export const GREEN_CARD_MONTHS = 12;
export const PAYMENT_NUMBER = "01704629926";

export type Audience = "general" | "islamic";
export type Tier = "golden" | "diamond";

export interface PlanDef {
  id: string;
  title: string;
  tier: Tier;
  audience: Audience;
  /** One-time registration fee */
  regFee: number;
  /** Monthly book fee */
  monthlyFee: number;
  popular?: boolean;
}

/** Shape passed to /checkout via router state (unchanged from before). */
export interface CheckoutPlan {
  id: string;
  title: string;
  initialPrice: number;
  recurringPrice: number;
  initialDetails: string;
  recurringDetails: string;
}

export const PLANS: PlanDef[] = [
  { id: "golden-reader", title: "গোল্ডেন রিডার", tier: "golden", audience: "general", regFee: 350, monthlyFee: 250 },
  { id: "diamond-reader", title: "ডায়মন্ড রিডার", tier: "diamond", audience: "general", regFee: 350, monthlyFee: 400, popular: true },
  { id: "islamic-golden", title: "ইসলামিক গোল্ডেন", tier: "golden", audience: "islamic", regFee: 250, monthlyFee: 400 },
  { id: "islamic-diamond", title: "ইসলামিক ডায়মন্ড", tier: "diamond", audience: "islamic", regFee: 250, monthlyFee: 500 },
];

export const AUDIENCE_LABEL: Record<Audience, string> = {
  general: "সাধারণ পাঠক",
  islamic: "ইসলামিক পাঠক",
};

/** Card colours per plan (full class names so Tailwind keeps them). */
export const PLAN_THEME: Record<
  string,
  { face: string; onFace: string; accent: string; track: string }
> = {
  "golden-reader": {
    face: "from-amber-200 via-amber-400 to-amber-700",
    onFace: "text-ink-950",
    accent: "text-amber-600",
    track: "bg-amber-400",
  },
  "diamond-reader": {
    face: "from-slate-100 via-sky-400 to-indigo-700",
    onFace: "text-white",
    accent: "text-indigo-600",
    track: "bg-sky-400",
  },
  "islamic-golden": {
    face: "from-lime-200 via-emerald-500 to-emerald-900",
    onFace: "text-white",
    accent: "text-emerald-700",
    track: "bg-emerald-400",
  },
  "islamic-diamond": {
    face: "from-teal-200 via-teal-500 to-teal-900",
    onFace: "text-white",
    accent: "text-teal-700",
    track: "bg-teal-400",
  },
};

/* ── Derived prices (same totals as the old hard-coded values) ── */
export const initialPrice = (p: PlanDef) => p.regFee + p.monthlyFee + COURIER_FEE;
export const recurringPrice = (p: PlanDef) => p.monthlyFee + COURIER_FEE;

export const initialDetails = (p: PlanDef) =>
  `${toBn(p.regFee)} (রেজিঃ) + ${toBn(p.monthlyFee)} (মাসিক) + ${toBn(COURIER_FEE)} (কুরিয়ার)`;
export const recurringDetails = (p: PlanDef) =>
  `${toBn(p.monthlyFee)} (মাসিক) + ${toBn(COURIER_FEE)} (কুরিয়ার)`;

export const toCheckoutPlan = (p: PlanDef): CheckoutPlan => ({
  id: p.id,
  title: p.title,
  initialPrice: initialPrice(p),
  recurringPrice: recurringPrice(p),
  initialDetails: initialDetails(p),
  recurringDetails: recurringDetails(p),
});

/** Total paid over `months` months: first payment + (months-1) recurring payments. */
export const totalCost = (p: PlanDef, months: number) =>
  initialPrice(p) + Math.max(0, months - 1) * recurringPrice(p);

export const BENEFITS: { icon: LucideIcon; text: string }[] = [
  { icon: BookOpen, text: "নিয়মিত বই কেনার ঝামেলা থেকে মুক্ত থাকার দারুণ সুযোগ" },
  { icon: BadgePercent, text: "বাইরে থেকে কিনলে যেটা বেশি খরচ হয়, সেটি অনেক কমে পাওয়া যায়" },
  { icon: Package, text: "মাসিক বইয়ের সাথে যেকোনো এক্সট্রা বই অর্ডার করা যাবে" },
  { icon: Truck, text: "এক্সট্রা বইয়ের জন্য কোনো কুরিয়ার চার্জ লাগবে না" },
  { icon: Sparkles, text: "নিয়মিত নতুন ও প্রিমিয়াম বই পড়ার সুযোগ" },
  { icon: CreditCard, text: "১ বছর ধারাবাহিক মেম্বার হলে স্পেশাল Green Card পাওয়া যাবে" },
  { icon: ShieldCheck, text: "Green Card থাকলে থাকবে এক্সক্লুসিভ সুবিধা ও প্রিভিলেজ" },
];

export const FAQ: { q: string; a: string }[] = [
  {
    q: "মাসিক ফি কবে পরিশোধ করতে হবে?",
    a: "মাসিক ফি এবং কুরিয়ার চার্জ প্রতি মাসের ১০ তারিখের মধ্যে পরিশোধ করতে হবে।",
  },
  {
    q: "টাকা বকেয়া থাকলে কী হবে?",
    a: "পরপর দুই মাসের টাকা বকেয়া থাকলে রেজিস্ট্রেশন বাতিল হিসেবে গণ্য হবে।",
  },
  {
    q: "মাসিক বইয়ের বাইরে এক্সট্রা বই নেওয়া যাবে?",
    a: "হ্যাঁ। মাসিক বইয়ের সাথে যেকোনো এক্সট্রা বই অর্ডার করা যাবে, এবং এক্সট্রা বইয়ের জন্য আলাদা কুরিয়ার চার্জ লাগবে না।",
  },
  {
    q: "Green Card কীভাবে পাওয়া যায়?",
    a: "১ বছর ধারাবাহিক মেম্বার থাকলে স্পেশাল Green Card পাওয়া যায়। Green Card থাকলে এক্সক্লুসিভ সুবিধা ও প্রিভিলেজ থাকে।",
  },
  {
    q: "ইসলামিক রিডার প্ল্যান কাদের জন্য?",
    a: "ইসলামিক পাঠকদের জন্য ২০-১০-২০২৩ তারিখ থেকে গোল্ডেন ও ডায়মন্ড রিডার সার্ভিসটি চালু হয়েছে। অন্যান্য সব নিয়মকানুন ইসলামিক রিডারদের জন্যও প্রযোজ্য।",
  },
  {
    q: "পেমেন্ট কীভাবে করব?",
    a: "bKash, Nagad বা Rocket-এ সেন্ড মানি করে ট্রানজেকশন আইডি দিয়ে অর্ডার সাবমিট করুন। আমরা ২-৪ ঘণ্টার মধ্যে অর্ডার ভেরিফাই করে কনফার্ম করব।",
  },
];
