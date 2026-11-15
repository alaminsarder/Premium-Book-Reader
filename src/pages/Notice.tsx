import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown, Pin, Search, SearchX } from "lucide-react";
import PageHero from "../components/PageHero";
import { useNotices } from "../hooks/useNotices";
import { CATEGORY_META, type NoticeCategory, type NoticeItem } from "../data/notices";
import { cn } from "../utils/cn";
import { formatBnDate, toBn } from "../utils/bn";

type Filter = "all" | NoticeCategory;

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "সব" },
  { id: "fee", label: CATEGORY_META.fee.label },
  { id: "rule", label: CATEGORY_META.rule.label },
  { id: "service", label: CATEGORY_META.service.label },
];

const LONG_BODY = 110;

const NoticeCard: React.FC<{ notice: NoticeItem }> = ({ notice }) => {
  const [expanded, setExpanded] = useState(false);
  const meta = CATEGORY_META[notice.category];
  const Icon = meta.icon;
  const isLong = notice.body.length > LONG_BODY;
  const date = notice.date ? formatBnDate(notice.date) : "";

  return (
    <article
      className={cn(
        "relative rounded-2xl bg-white p-5 shadow-sm ring-1 ring-ink-900/10 sm:p-6",
        notice.pinned && "ring-amber-300"
      )}
    >
      {notice.pinned && (
        <span aria-hidden className="absolute bottom-5 left-0 top-5 w-1 rounded-r bg-amber-500" />
      )}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        {notice.pinned && (
          <span className="inline-flex items-center gap-1 rounded-full bg-ink-950 px-2.5 py-1 text-xs font-bold text-amber-300">
            <Pin className="h-3 w-3" /> গুরুত্বপূর্ণ
          </span>
        )}
        <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1", meta.chip)}>
          <Icon className="h-3.5 w-3.5" /> {meta.label}
        </span>
        {date && <time dateTime={notice.date} className="text-sm text-ink-500">{date}</time>}
      </div>

      <h3 className="mt-3 font-serif text-xl font-bold leading-snug text-ink-900">{notice.title}</h3>
      <p className={cn("mt-2 leading-relaxed text-ink-700", isLong && !expanded && "line-clamp-2")}>
        {notice.body}
      </p>

      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          aria-expanded={expanded}
          className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-amber-700 hover:text-amber-800"
        >
          {expanded ? "কম দেখুন" : "আরও পড়ুন"}
          <ChevronDown className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")} />
        </button>
      )}
    </article>
  );
};

const Skeleton: React.FC = () => (
  <div className="animate-pulse space-y-3 rounded-2xl bg-white p-6 ring-1 ring-ink-900/10" aria-hidden>
    <div className="flex gap-3">
      <div className="h-6 w-24 rounded-full bg-ink-900/10" />
      <div className="h-6 w-28 rounded-full bg-ink-900/10" />
    </div>
    <div className="h-6 w-3/4 rounded bg-ink-900/10" />
    <div className="h-4 w-full rounded bg-ink-900/5" />
    <div className="h-4 w-2/3 rounded bg-ink-900/5" />
  </div>
);

const Notice: React.FC = () => {
  const { items, loading } = useNotices();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter(
      (n) =>
        (filter === "all" || n.category === filter) &&
        (!q || n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q))
    );
  }, [items, query, filter]);

  const resetFilters = () => {
    setQuery("");
    setFilter("all");
  };

  return (
    <div className="bg-gray-50 pb-24">
      <PageHero title="নোটিশ বোর্ড" subtitle="মেম্বারশিপের নিয়ম, পেমেন্টের সময়সীমা ও নতুন সার্ভিসের খবর এখানে পাবেন।" />

      <div className="mx-auto grid max-w-7xl gap-8 px-4 pt-10 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div className="lg:col-span-2">
          {/* Search + filters */}
          <div className="space-y-4">
            <div className="relative">
              <label htmlFor="notice-search" className="sr-only">নোটিশ খুঁজুন</label>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-500" />
              <input
                id="notice-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="নোটিশ খুঁজুন"
                className="w-full rounded-xl border border-ink-900/15 bg-white py-3 pl-12 pr-4 text-ink-900 placeholder:text-ink-500"
              />
            </div>

            <div role="group" aria-label="ক্যাটেগরি" className="flex flex-wrap gap-2">
              {FILTERS.map((f) => {
                const active = filter === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setFilter(f.id)}
                    className={cn(
                      "rounded-full px-4 py-1.5 text-sm font-semibold transition-colors",
                      active
                        ? "bg-ink-900 text-white"
                        : "bg-white text-ink-700 ring-1 ring-ink-900/15 hover:ring-ink-900/40"
                    )}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* List */}
          <div className="mt-6 space-y-4" aria-busy={loading}>
            {loading ? (
              <>
                <Skeleton />
                <Skeleton />
                <Skeleton />
              </>
            ) : visible.length > 0 ? (
              <>
                <p className="text-sm text-ink-500">{toBn(visible.length)}টি নোটিশ</p>
                {visible.map((n) => (
                  <NoticeCard key={n.id} notice={n} />
                ))}
              </>
            ) : (
              <div className="rounded-2xl bg-white p-10 text-center ring-1 ring-ink-900/10">
                <SearchX className="mx-auto h-10 w-10 text-ink-500" />
                <p className="mt-3 text-lg font-semibold text-ink-900">কোনো নোটিশ পাওয়া যায়নি</p>
                <p className="mt-1 text-ink-600">অন্য শব্দ দিয়ে খুঁজুন, অথবা সব নোটিশ দেখুন।</p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-5 rounded-xl bg-ink-900 px-5 py-2.5 font-semibold text-white hover:bg-ink-700"
                >
                  সব নোটিশ দেখুন
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Deadline leaf */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="overflow-hidden rounded-2xl bg-white shadow-[0_24px_48px_-28px_rgba(13,18,32,0.55)] ring-1 ring-ink-900/10">
            <div className="bg-ink-950 px-6 py-3 text-center font-semibold text-amber-300">
              প্রতি মাসে ফি পরিশোধের শেষ দিন
            </div>
            <div className="px-6 py-8 text-center">
              <p className="font-serif text-8xl font-bold leading-none text-ink-900">{toBn(10)}</p>
              <p className="mt-3 font-serif text-xl font-bold text-ink-900">তারিখ</p>
              <p className="mx-auto mt-3 max-w-[16rem] leading-relaxed text-ink-600">
                এই তারিখের মধ্যে মাসিক ফি ও কুরিয়ার চার্জ পরিশোধ করুন। পরপর দুই মাস বকেয়া থাকলে রেজিস্ট্রেশন বাতিল হবে।
              </p>
            </div>
            <Link
              to="/membership"
              className="flex items-center justify-between border-t border-ink-900/10 px-6 py-4 font-semibold text-amber-800 transition-colors hover:bg-amber-50"
            >
              মেম্বারশিপ প্ল্যান দেখুন <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Notice;
