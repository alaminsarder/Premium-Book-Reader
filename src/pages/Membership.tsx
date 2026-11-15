import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, ChevronDown, CreditCard, Crown, Gem, Megaphone } from "lucide-react";
import PageHero from "../components/PageHero";
import { cn } from "../utils/cn";
import { formatTaka, toBn } from "../utils/bn";
import {
  AUDIENCE_LABEL,
  BENEFITS,
  COURIER_FEE,
  FAQ,
  GREEN_CARD_MONTHS,
  PLANS,
  PLAN_THEME,
  initialPrice,
  recurringPrice,
  toCheckoutPlan,
  totalCost,
  type PlanDef,
} from "../data/membership";

const MAX_MONTHS = 24;

/* ─────────────────────────────────────────────
 *  Plan card — styled like a physical member card
 * ───────────────────────────────────────────── */
const PlanCard: React.FC<{ plan: PlanDef; onSelect: (p: PlanDef) => void }> = ({ plan, onSelect }) => {
  const theme = PLAN_THEME[plan.id];
  const Icon = plan.tier === "golden" ? Crown : Gem;

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_24px_48px_-28px_rgba(13,18,32,0.55)] ring-1 ring-ink-900/10",
        plan.popular && "ring-2 ring-amber-500"
      )}
    >
      {/* Card face */}
      <div
        className={cn(
          "relative flex h-44 flex-col justify-between overflow-hidden bg-gradient-to-br p-5",
          theme.face,
          theme.onFace
        )}
      >
        <div className="relative flex items-start justify-between">
          <Icon className="h-9 w-9" strokeWidth={1.75} />
          <span className="rounded-full bg-black/15 px-2.5 py-1 text-xs font-semibold backdrop-blur-sm">
            {AUDIENCE_LABEL[plan.audience]}
          </span>
        </div>
        <h3 className="relative font-serif text-2xl font-bold leading-snug">{plan.title}</h3>

        {/* Concentric rings, like a card's guilloche pattern */}
        <svg
          aria-hidden
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          className="absolute -bottom-14 -right-12 h-48 w-48 opacity-20"
        >
          {[48, 38, 28, 18, 8].map((r) => (
            <circle key={r} cx="50" cy="50" r={r} />
          ))}
        </svg>
        {/* Sheen on hover */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/30 blur-md transition-transform duration-700 ease-out group-hover:translate-x-[420%]"
        />
      </div>

      {plan.popular && (
        <span className="absolute left-5 top-[10.2rem] z-10 rounded-full bg-ink-950 px-3 py-1 text-xs font-bold text-amber-300 shadow-lg">
          সবচেয়ে জনপ্রিয়
        </span>
      )}

      {/* Details */}
      <div className="flex flex-1 flex-col p-5 pt-7">
        <p className="text-sm text-ink-500">প্রথমবার পেমেন্ট</p>
        <p className="font-serif text-4xl font-bold text-ink-900">{formatTaka(initialPrice(plan))}</p>

        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink-500">রেজিস্ট্রেশন ফি</dt>
            <dd className="font-semibold text-ink-800">{formatTaka(plan.regFee)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-500">মাসিক ফি</dt>
            <dd className="font-semibold text-ink-800">{formatTaka(plan.monthlyFee)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-500">কুরিয়ার চার্জ</dt>
            <dd className="font-semibold text-ink-800">{formatTaka(COURIER_FEE)}</dd>
          </div>
        </dl>

        <div className="my-5 flex items-baseline justify-between border-t border-dashed border-ink-900/20 pt-4">
          <span className="text-sm text-ink-500">পরবর্তী মাস থেকে</span>
          <span className={cn("text-xl font-bold", theme.accent)}>
            {formatTaka(recurringPrice(plan))}
            <span className="text-sm font-medium text-ink-500"> / মাস</span>
          </span>
        </div>

        <button
          type="button"
          onClick={() => onSelect(plan)}
          className="mt-auto w-full rounded-xl bg-ink-900 py-3 font-bold text-white transition-colors hover:bg-ink-700 active:scale-[0.99]"
        >
          সাবস্ক্রাইব করুন
        </button>
      </div>
    </article>
  );
};

/* ─────────────────────────────────────────────
 *  Cost calculator
 * ───────────────────────────────────────────── */
const Calculator: React.FC<{ onSelect: (p: PlanDef) => void }> = ({ onSelect }) => {
  const [planId, setPlanId] = useState("diamond-reader");
  const [months, setMonths] = useState(6);

  const plan = PLANS.find((p) => p.id === planId) ?? PLANS[0];
  const total = totalCost(plan, months);
  const average = Math.round(total / months);
  const remaining = Math.max(0, GREEN_CARD_MONTHS - months);
  const progress = Math.min(100, (months / GREEN_CARD_MONTHS) * 100);
  const unlocked = months >= GREEN_CARD_MONTHS;
  const markerLeft = ((GREEN_CARD_MONTHS - 1) / (MAX_MONTHS - 1)) * 100;

  return (
    <section aria-labelledby="calc-title" className="mt-20 grid gap-8 lg:grid-cols-5">
      <div className="lg:col-span-2">
        <h2 id="calc-title" className="font-serif text-3xl font-bold leading-snug text-ink-900">
          কত মাসে কত খরচ হবে?
        </h2>
        <p className="mt-3 max-w-md text-ink-600">
          প্ল্যান আর মাসের সংখ্যা বেছে নিন। রেজিস্ট্রেশন ফি শুধু প্রথম মাসে লাগে।
        </p>

        <div role="radiogroup" aria-label="প্ল্যান" className="mt-6 grid grid-cols-2 gap-2">
          {PLANS.map((p) => {
            const active = p.id === planId;
            return (
              <button
                key={p.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setPlanId(p.id)}
                className={cn(
                  "rounded-xl border px-3 py-2.5 text-left text-sm font-semibold transition-colors",
                  active
                    ? "border-ink-900 bg-ink-900 text-white"
                    : "border-ink-900/15 bg-white text-ink-700 hover:border-ink-900/40"
                )}
              >
                {p.title}
              </button>
            );
          })}
        </div>

        <div className="mt-8">
          <div className="flex items-baseline justify-between">
            <label htmlFor="months" className="font-semibold text-ink-800">মেম্বারশিপের মেয়াদ</label>
            <span className="font-serif text-2xl font-bold text-ink-900">{toBn(months)} মাস</span>
          </div>
          <input
            id="months"
            type="range"
            min={1}
            max={MAX_MONTHS}
            step={1}
            value={months}
            onChange={(e) => setMonths(Number(e.target.value))}
            className="mt-3 h-2 w-full cursor-pointer accent-amber-600"
          />
          <div className="relative mt-1 h-10 text-xs text-ink-500">
            <span className="absolute left-0">{toBn(1)}</span>
            <span className="absolute right-0">{toBn(MAX_MONTHS)}</span>
            <span
              className="absolute -translate-x-1/2 whitespace-nowrap font-semibold text-amber-700"
              style={{ left: `${markerLeft}%` }}
            >
              ▲ Green Card
            </span>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[28px] bg-ink-950 p-6 text-white sm:p-8 lg:col-span-3">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(30rem_16rem_at_100%_0%,rgba(245,158,11,0.2),transparent_60%)]"
        />
        <div className="relative">
          <p className="text-white/60">
            {plan.title}, {toBn(months)} মাসে মোট
          </p>
          <p aria-live="polite" className="mt-1 font-serif text-6xl font-bold leading-tight text-amber-300 sm:text-7xl">
            {formatTaka(total)}
          </p>

          <dl className="mt-6 space-y-3 border-t border-white/10 pt-5 text-sm sm:text-base">
            <div className="flex justify-between gap-4">
              <dt className="text-white/60">প্রথম মাস (রেজিস্ট্রেশনসহ)</dt>
              <dd className="font-semibold">{formatTaka(initialPrice(plan))}</dd>
            </div>
            {months > 1 && (
              <div className="flex justify-between gap-4">
                <dt className="text-white/60">
                  পরের {toBn(months - 1)} মাস × {formatTaka(recurringPrice(plan))}
                </dt>
                <dd className="font-semibold">{formatTaka((months - 1) * recurringPrice(plan))}</dd>
              </div>
            )}
            <div className="flex justify-between gap-4">
              <dt className="text-white/60">গড়ে প্রতি মাসে</dt>
              <dd className="font-semibold">{formatTaka(average)}</dd>
            </div>
          </dl>

          <div className="mt-6 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "grid h-10 w-10 shrink-0 place-items-center rounded-lg",
                  unlocked ? "bg-emerald-400 text-ink-950" : "bg-white/10 text-white/70"
                )}
              >
                {unlocked ? <Check className="h-5 w-5" /> : <CreditCard className="h-5 w-5" />}
              </span>
              <p className="text-sm leading-snug sm:text-base">
                {unlocked
                  ? "এই মেয়াদে আপনি Green Card-এর যোগ্য হবেন।"
                  : `Green Card পেতে আরও ${toBn(remaining)} মাস ধারাবাহিক থাকতে হবে।`}
              </p>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className={cn("h-full rounded-full transition-all duration-300", unlocked ? "bg-emerald-400" : "bg-amber-400")}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => onSelect(plan)}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 py-3.5 text-lg font-bold text-ink-950 transition-colors hover:bg-amber-400"
          >
            {plan.title} নিন <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
 *  FAQ accordion
 * ───────────────────────────────────────────── */
const FaqItem: React.FC<{ q: string; a: string; id: string }> = ({ q, a, id }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-ink-900/10">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center justify-between gap-4 py-5 text-left text-lg font-semibold text-ink-900"
        >
          {q}
          <ChevronDown className={cn("h-5 w-5 shrink-0 text-ink-500 transition-transform", open && "rotate-180")} />
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`${id}-panel`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="pb-5 leading-relaxed text-ink-600">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─────────────────────────────────────────────
 *  Page
 * ───────────────────────────────────────────── */
const Membership: React.FC = () => {
  const navigate = useNavigate();

  const handleSubscribe = (plan: PlanDef) => {
    navigate("/checkout", { state: { plan: toCheckoutPlan(plan) } });
  };

  return (
    <div className="bg-gray-50 pb-24">
      <PageHero
        title="আমাদের মেম্বারশিপ প্ল্যান"
        subtitle="প্রতি মাসে বাছাই করা বই, কুরিয়ারে আপনার দরজায়।"
        overlap
      />

      <div className="mx-auto -mt-32 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((plan) => (
            <PlanCard key={plan.id} plan={plan} onSelect={handleSubscribe} />
          ))}
        </div>

        <Calculator onSelect={handleSubscribe} />

        {/* Benefits */}
        <section aria-labelledby="benefits-title" className="mt-24">
          <h2 id="benefits-title" className="font-serif text-3xl font-bold leading-snug text-ink-900">
            মেম্বার হলে যা পাবেন
          </h2>
          <ul className="mt-8 grid gap-x-12 md:grid-cols-2">
            {BENEFITS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-4 border-b border-ink-900/10 py-5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-amber-100 text-amber-700">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="pt-1.5 leading-relaxed text-ink-800">{text}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* FAQ */}
        <section aria-labelledby="faq-title" className="mt-24 grid gap-10 lg:grid-cols-3">
          <div>
            <h2 id="faq-title" className="font-serif text-3xl font-bold leading-snug text-ink-900">
              নিয়মাবলী ও সাধারণ প্রশ্ন
            </h2>
            <Link
              to="/notice"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-amber-100 px-4 py-2.5 font-semibold text-amber-900 transition-colors hover:bg-amber-200"
            >
              <Megaphone className="h-4 w-4" /> সর্বশেষ নোটিশ দেখুন
            </Link>
          </div>
          <div className="border-t border-ink-900/10 lg:col-span-2">
            {FAQ.map((item, i) => (
              <FaqItem key={item.q} id={`faq-${i}`} q={item.q} a={item.a} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Membership;
