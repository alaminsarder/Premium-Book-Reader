import { Banknote, Gavel, Sparkles, type LucideIcon } from "lucide-react";

export type NoticeCategory = "fee" | "rule" | "service";

export interface NoticeItem {
  id: string;
  title: string;
  body: string;
  category: NoticeCategory;
  pinned?: boolean;
  /** ISO date string. Optional – undated notices sort last. */
  date?: string;
}

export const CATEGORY_META: Record<
  NoticeCategory,
  { label: string; icon: LucideIcon; chip: string }
> = {
  fee: { label: "ফি ও পেমেন্ট", icon: Banknote, chip: "bg-amber-50 text-amber-800 ring-amber-200" },
  rule: { label: "নিয়মাবলী", icon: Gavel, chip: "bg-rose-50 text-rose-800 ring-rose-200" },
  service: { label: "নতুন সার্ভিস", icon: Sparkles, chip: "bg-emerald-50 text-emerald-800 ring-emerald-200" },
};

export const normalizeCategory = (value: unknown): NoticeCategory =>
  value === "fee" || value === "rule" || value === "service" ? value : "rule";

/** Shown while Firestore is loading, and if the `notices` collection is empty/unreachable. */
export const FALLBACK_NOTICES: NoticeItem[] = [
  {
    id: "fee-deadline",
    title: "মাসিক ফি ও কুরিয়ার চার্জ পরিশোধের সময়",
    body: "মাসিক ফি এবং কুরিয়ার চার্জ প্রতি মাসের ১০ তারিখের মধ্যে পরিশোধ করিতে হইবে।",
    category: "fee",
    pinned: true,
  },
  {
    id: "cancel-rule",
    title: "রেজিস্ট্রেশন বাতিলের শর্ত",
    body: "পরপর যদি দুই মাসের টাকা বকেয়া থাকে তবে তার রেজিষ্ট্রেশন বাতিল হিসেবে গণ্য হবে।",
    category: "rule",
    pinned: true,
  },
  {
    id: "islamic-service",
    title: "ইসলামিক পাঠকদের জন্য গোল্ডেন ও ডায়মন্ড রিডার সার্ভিস",
    body: "২০-১০-২০২৩ তারিখ থেকে ইসলামিক পাঠকদের জন্য গোল্ডেন ও ডায়মন্ড রিডার সার্ভিসটি চালু হয়েছে।",
    category: "service",
    date: "2023-10-20",
  },
  {
    id: "islamic-rules",
    title: "ইসলামিক রিডারদের জন্য নিয়মকানুন",
    body: "পোস্টে উল্লেখিত সকল নিয়মকানুন ইসলামিক রিডারদের জন্যও প্রযোজ্য।",
    category: "rule",
  },
];
