import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";
import { AlertCircle, ArrowLeft, Check, Copy, ShieldCheck } from "lucide-react";
import { db } from "../firebase";
import PageHero from "../components/PageHero";
import { useCart } from "../context/CartContext";
import { COURIER_FEE, PAYMENT_NUMBER, type CheckoutPlan } from "../data/membership";
import { cn } from "../utils/cn";
import { formatTaka, toBn, toEn } from "../utils/bn";

const METHODS = ["bKash", "Nagad", "Rocket"] as const;
type Method = (typeof METHODS)[number];

/** Delivery charge for normal book orders (change if you want). */
const BOOK_DELIVERY_FEE = COURIER_FEE;

type FormData = {
  name: string;
  phone: string;
  address: string;
  courierAddress: string;
  transactionId: string;
};
type Errors = Partial<Record<keyof FormData | "method", string>>;

const BD_PHONE = /^(?:\+?88)?01[3-9]\d{8}$/;

const inputClass = (hasError?: boolean) =>
  cn(
    "w-full rounded-xl border bg-white px-4 py-3 text-ink-900 placeholder:text-ink-500/70",
    hasError ? "border-rose-400 bg-rose-50/40" : "border-ink-900/15"
  );

/** Firestore never rejects when offline, it just waits. This makes it fail after `ms`. */
const withTimeout = <T,>(promise: Promise<T>, ms: number): Promise<T> =>
  new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("timeout")), ms);
    promise.then(
      (v) => {
        clearTimeout(timer);
        resolve(v);
      },
      (e) => {
        clearTimeout(timer);
        reject(e);
      }
    );
  });

const Field: React.FC<{
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  children: React.ReactNode;
}> = ({ id, label, optional, error, children }) => (
  <div>
    <label htmlFor={id} className="mb-1.5 block font-semibold text-ink-800">
      {label}
      {optional && <span className="ml-1.5 text-sm font-normal text-ink-500">(ঐচ্ছিক)</span>}
    </label>
    {children}
    {error && (
      <p id={`${id}-error`} className="mt-1.5 flex items-center gap-1.5 text-sm text-rose-600">
        <AlertCircle className="h-4 w-4" /> {error}
      </p>
    )}
  </div>
);

const Checkout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, totalPrice, clearCart } = useCart();

  // Plan order comes from router state. Otherwise it's a book (cart) order.
  const plan = location.state?.plan as CheckoutPlan | undefined;
  const isBookOrder = !plan && cart.length > 0;

  const deliveryFee = isBookOrder ? BOOK_DELIVERY_FEE : 0;
  const payable = plan ? plan.initialPrice : totalPrice + deliveryFee;

  const [form, setForm] = useState<FormData>({
    name: "",
    phone: "",
    address: "",
    courierAddress: "",
    transactionId: "",
  });
  const [method, setMethod] = useState<Method | "">("");
  const [errors, setErrors] = useState<Errors>({});
  const [submitError, setSubmitError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [placed, setPlaced] = useState<{ ref: string; title: string; amount: number } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const copyNumber = async () => {
    try {
      await navigator.clipboard.writeText(PAYMENT_NUMBER);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* number is visible on screen anyway */
    }
  };

  const validate = (): Errors => {
    const e: Errors = {};
    if (!form.name.trim()) e.name = "আপনার নাম লিখুন।";
    const phone = toEn(form.phone).replace(/[\s-]/g, "");
    if (!phone) e.phone = "ফোন নম্বর লিখুন।";
    else if (!BD_PHONE.test(phone)) e.phone = "সঠিক ১১ সংখ্যার মোবাইল নম্বর দিন (যেমন ০১৭XXXXXXXX)।";
    if (!form.address.trim()) e.address = "আপনার পূর্ণ ঠিকানা লিখুন।";
    if (!method) e.method = "একটি পেমেন্ট মেথড বেছে নিন।";
    else if (form.transactionId.trim().length < 6) e.transactionId = "পেমেন্টের ট্রানজেকশন আইডি লিখুন।";
    return e;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (isProcessing || (!plan && cart.length === 0)) return;

    const found = validate();
    setErrors(found);
    setSubmitError("");
    if (Object.keys(found).length > 0) {
      requestAnimationFrame(() => {
        document.querySelector<HTMLElement>("[data-invalid='true']")?.focus();
      });
      return;
    }

    const customer = {
      customerName: form.name.trim(),
      phone: toEn(form.phone).replace(/[\s-]/g, ""),
      address: form.address.trim(),
      courierAddress: form.courierAddress.trim(),
      transactionId: form.transactionId.trim(),
      paymentMethod: method,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    const payload = plan
      ? {
          ...customer,
          type: "membership",
          planId: plan.id,
          planTitle: plan.title,
          price: plan.initialPrice,
        }
      : {
          ...customer,
          type: "book",
          items: cart.map((i) => ({
            id: i.id,
            title: i.title,
            price: i.price,
            quantity: i.quantity,
          })),
          subtotal: totalPrice,
          deliveryFee,
          price: payable,
        };

    setIsProcessing(true);
    try {
      const ref = await withTimeout(addDoc(collection(db, "orders"), payload), 15000);
      setPlaced({
        ref: ref.id.slice(0, 8).toUpperCase(),
        title: plan ? plan.title : `${toBn(cart.length)}টি বই`,
        amount: payable,
      });
      if (!plan) clearCart();
    } catch (error) {
      console.error("Firebase Error: ", error);
      const code = (error as { code?: string }).code;
      if (code === "permission-denied") {
        setSubmitError("Firestore অনুমতি দিচ্ছে না (permission-denied)। Firebase Console এ Rules ঠিক করুন।");
      } else if ((error as Error).message === "timeout") {
        setSubmitError("সার্ভারে পৌঁছানো যাচ্ছে না। ইন্টারনেট সংযোগ দেখে আবার চেষ্টা করুন।");
      } else {
        setSubmitError(`অর্ডার জমা দেওয়া যায়নি${code ? ` (${code})` : ""}। আবার চেষ্টা করুন।`);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  /* ── Success ── */
  if (placed) {
    return (
      <div className="grid min-h-[70vh] place-items-center px-4 py-12">
        <div className="w-full max-w-lg rounded-3xl bg-white p-8 text-center shadow-[0_24px_48px_-28px_rgba(13,18,32,0.55)] ring-1 ring-ink-900/10">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-700">
            <Check className="h-8 w-8" strokeWidth={2.5} />
          </span>
          <h2 className="mt-5 font-serif text-3xl font-bold text-ink-900">অর্ডার জমা হয়েছে</h2>
          <p className="mt-3 leading-relaxed text-ink-600">
            ধন্যবাদ! আমরা ২-৪ ঘণ্টার মধ্যে আপনার পেমেন্ট ভেরিফাই করে অর্ডারটি কনফার্ম করব।
          </p>
          <dl className="mt-6 space-y-2 rounded-2xl bg-gray-50 p-4 text-left">
            <div className="flex justify-between">
              <dt className="text-ink-500">অর্ডার</dt>
              <dd className="font-semibold">{placed.title}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-500">পরিশোধিত</dt>
              <dd className="font-semibold">{formatTaka(placed.amount)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-500">অর্ডার রেফারেন্স</dt>
              <dd className="font-mono font-semibold tracking-wider">{placed.ref}</dd>
            </div>
          </dl>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => navigate("/")}
              className="flex-1 rounded-xl bg-ink-900 py-3 font-bold text-white hover:bg-ink-700"
            >
              হোম পেজে ফিরুন
            </button>
            <Link
              to="/notice"
              className="flex-1 rounded-xl bg-amber-100 py-3 text-center font-bold text-amber-900 hover:bg-amber-200"
            >
              নোটিশ দেখুন
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ── Nothing to order ── */
  if (!plan && cart.length === 0) {
    return (
      <div className="grid min-h-[60vh] place-items-center px-4">
        <div className="max-w-md rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-ink-900/10">
          <h2 className="font-serif text-2xl font-bold text-ink-900">অর্ডার করার মতো কিছু নেই</h2>
          <p className="mt-2 text-ink-600">
            কার্টে বই যোগ করুন, অথবা মেম্বারশিপ পেজ থেকে একটি প্ল্যান বেছে নিন।
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-ink-900 px-6 py-3 font-bold text-white hover:bg-ink-700"
            >
              <ArrowLeft className="h-4 w-4" /> বই দেখুন
            </Link>
            <Link
              to="/membership"
              className="inline-flex items-center justify-center rounded-xl bg-amber-100 px-6 py-3 font-bold text-amber-900 hover:bg-amber-200"
            >
              প্ল্যান দেখুন
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ── Form ── */
  return (
    <div className="bg-gray-50 pb-24">
      <PageHero
        title="পেমেন্ট সম্পন্ন করুন"
        subtitle={
          plan
            ? `${plan.title} প্ল্যানের অর্ডার, দুটি ধাপে: তথ্য দিন, তারপর পেমেন্ট করুন।`
            : "বইয়ের অর্ডার, দুটি ধাপে: তথ্য দিন, তারপর পেমেন্ট করুন।"
        }
      />

      <form
        onSubmit={handleSubmit}
        noValidate
        className="mx-auto grid max-w-7xl gap-8 px-4 pt-10 sm:px-6 lg:grid-cols-3 lg:px-8"
      >
        <div className="space-y-6 lg:col-span-2">
          {/* Step 1 */}
          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-ink-900/10 sm:p-8">
            <h2 className="mb-5 flex items-center gap-3 font-serif text-xl font-bold text-ink-900">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-ink-900 text-sm text-white">
                {toBn(1)}
              </span>
              আপনার তথ্য
            </h2>
            <div className="space-y-4">
              <Field id="name" label="নাম" error={errors.name}>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="আপনার নাম"
                  aria-invalid={!!errors.name}
                  data-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  className={inputClass(!!errors.name)}
                />
              </Field>
              <Field id="phone" label="ফোন নম্বর" error={errors.phone}>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="০১XXXXXXXXX"
                  aria-invalid={!!errors.phone}
                  data-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                  className={inputClass(!!errors.phone)}
                />
              </Field>
              <Field id="address" label="পূর্ণ ঠিকানা" error={errors.address}>
                <textarea
                  id="address"
                  name="address"
                  rows={2}
                  autoComplete="street-address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="গ্রাম/মহল্লা, থানা, জেলা"
                  aria-invalid={!!errors.address}
                  data-invalid={!!errors.address}
                  aria-describedby={errors.address ? "address-error" : undefined}
                  className={inputClass(!!errors.address)}
                />
              </Field>
              <Field id="courierAddress" label="সুন্দরবন কুরিয়ার ঠিকানা" optional>
                <textarea
                  id="courierAddress"
                  name="courierAddress"
                  rows={2}
                  value={form.courierAddress}
                  onChange={handleChange}
                  placeholder="শাখার নাম ও জেলা"
                  className={inputClass()}
                />
              </Field>
            </div>
          </section>

          {/* Step 2 */}
          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-ink-900/10 sm:p-8">
            <h2 className="mb-5 flex items-center gap-3 font-serif text-xl font-bold text-ink-900">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-ink-900 text-sm text-white">
                {toBn(2)}
              </span>
              পেমেন্ট
            </h2>

            <div role="radiogroup" aria-label="পেমেন্ট মেথড" className="grid grid-cols-3 gap-3">
              {METHODS.map((m) => {
                const active = method === m;
                return (
                  <button
                    key={m}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    data-invalid={!!errors.method && m === METHODS[0]}
                    onClick={() => {
                      setMethod(m);
                      setErrors((prev) => ({ ...prev, method: undefined }));
                    }}
                    className={cn(
                      "rounded-xl border py-3 font-semibold transition-colors",
                      active
                        ? "border-ink-900 bg-ink-900 text-white"
                        : "border-ink-900/15 bg-white text-ink-700 hover:border-ink-900/40"
                    )}
                  >
                    {m}
                  </button>
                );
              })}
            </div>
            {errors.method && (
              <p className="mt-2 flex items-center gap-1.5 text-sm text-rose-600">
                <AlertCircle className="h-4 w-4" /> {errors.method}
              </p>
            )}

            {method && (
              <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-5">
                <p className="text-sm text-amber-900">
                  আমাদের {method} নম্বরে {formatTaka(payable)} সেন্ড মানি করুন:
                </p>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <p className="font-mono text-2xl font-bold tracking-wider text-ink-900">{PAYMENT_NUMBER}</p>
                  <button
                    type="button"
                    onClick={copyNumber}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-amber-900 ring-1 ring-amber-300 hover:bg-amber-100"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? "কপি হয়েছে" : "কপি"}
                  </button>
                </div>
                <div className="mt-4">
                  <Field id="transactionId" label="ট্রানজেকশন আইডি" error={errors.transactionId}>
                    <input
                      id="transactionId"
                      name="transactionId"
                      type="text"
                      autoComplete="off"
                      value={form.transactionId}
                      onChange={handleChange}
                      placeholder="পেমেন্টের পর পাওয়া আইডি লিখুন"
                      aria-invalid={!!errors.transactionId}
                      data-invalid={!!errors.transactionId}
                      aria-describedby={errors.transactionId ? "transactionId-error" : undefined}
                      className={inputClass(!!errors.transactionId)}
                    />
                  </Field>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl bg-ink-950 p-6 text-white shadow-[0_24px_48px_-28px_rgba(13,18,32,0.7)]">
            {plan ? (
              <>
                <p className="text-white/60">আপনার প্ল্যান</p>
                <h3 className="font-serif text-2xl font-bold">{plan.title}</h3>

                <div className="mt-5 border-t border-white/10 pt-5">
                  <p className="text-white/60">এখন পরিশোধ করতে হবে</p>
                  <p className="font-serif text-5xl font-bold text-amber-300">{formatTaka(plan.initialPrice)}</p>
                  <p className="mt-2 text-sm text-white/60">{plan.initialDetails}</p>
                </div>

                <div className="mt-5 border-t border-white/10 pt-5">
                  <p className="text-white/60">পরবর্তী মাস থেকে</p>
                  <p className="text-xl font-bold">
                    {formatTaka(plan.recurringPrice)}{" "}
                    <span className="text-sm font-normal text-white/60">/ মাস</span>
                  </p>
                  <p className="mt-1 text-sm text-white/60">{plan.recurringDetails}</p>
                </div>
              </>
            ) : (
              <>
                <p className="text-white/60">আপনার অর্ডার</p>
                <h3 className="font-serif text-2xl font-bold">{toBn(cart.length)}টি বই</h3>

                <ul className="mt-4 space-y-3 border-t border-white/10 pt-4">
                  {cart.map((item) => (
                    <li key={item.id} className="flex items-start justify-between gap-3 text-sm">
                      <span className="text-white/80">
                        {item.title}
                        <span className="text-white/50"> × {item.quantity}</span>
                      </span>
                      <span className="shrink-0 font-semibold">{formatTaka(item.price * item.quantity)}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 space-y-2 border-t border-white/10 pt-4 text-sm">
                  <div className="flex justify-between text-white/70">
                    <span>বইয়ের দাম</span>
                    <span>{formatTaka(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>ডেলিভারি চার্জ</span>
                    <span>{formatTaka(deliveryFee)}</span>
                  </div>
                </div>

                <div className="mt-4 border-t border-white/10 pt-4">
                  <p className="text-white/60">এখন পরিশোধ করতে হবে</p>
                  <p className="font-serif text-5xl font-bold text-amber-300">{formatTaka(payable)}</p>
                </div>

                <Link
                  to="/cart"
                  className="mt-3 inline-block text-sm text-white/60 underline hover:text-white"
                >
                  কার্ট এডিট করুন
                </Link>
              </>
            )}

            {submitError && (
              <p
                role="alert"
                className="mt-5 flex items-start gap-2 rounded-xl bg-rose-500/15 p-3 text-sm text-rose-200"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {submitError}
              </p>
            )}

            <button
              type="submit"
              disabled={isProcessing}
              className="mt-6 w-full rounded-xl bg-amber-500 py-3.5 text-lg font-bold text-ink-950 transition-colors hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isProcessing ? "জমা দেওয়া হচ্ছে…" : "অর্ডার সাবমিট করুন"}
            </button>

            <p className="mt-4 flex items-start gap-2 text-sm text-white/60">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
              ২-৪ ঘণ্টার মধ্যে আমরা ট্রানজেকশন ভেরিফাই করে কনফার্ম করব।
            </p>
          </div>

          <Link
            to={plan ? "/membership" : "/cart"}
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-ink-600 hover:text-ink-900"
          >
            <ArrowLeft className="h-4 w-4" /> {plan ? "অন্য প্ল্যান বেছে নিন" : "কার্টে ফিরে যান"}
          </Link>
        </aside>
      </form>
    </div>
  );
};

export default Checkout;