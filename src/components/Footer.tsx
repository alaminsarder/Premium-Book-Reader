import React, { useState } from "react";
import { BookOpen, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";

type Status = "idle" | "sending" | "done" | "error";

const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(value)) {
      setStatus("error");
      return;
    }
    setStatus("sending");
    try {
      await addDoc(collection(db, "subscribers"), {
        email: value,
        createdAt: new Date().toISOString(),
      });
      setStatus("done");
      setEmail("");
    } catch (err) {
      console.error("Subscribe error:", err);
      setStatus("error");
    }
  };

  return (
    <footer className="bg-ink-950 pb-8 pt-16 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-4">
          <div>
            <Link to="/" className="mb-5 flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/10">
                <BookOpen className="h-5 w-5 text-amber-400" />
              </span>
              <span className="font-serif text-xl font-bold">Premium Book Reader</span>
            </Link>
            <p className="leading-relaxed text-white/60">Shop smarter. Read better. Go Premium.</p>
          </div>

          <div>
            <h4 className="mb-5 font-serif text-lg font-bold">Quick Links</h4>
            <ul className="space-y-3 text-white/60">
              <li><Link to="/" className="transition-colors hover:text-white">Home</Link></li>
              <li><Link to="/membership" className="transition-colors hover:text-white">Membership</Link></li>
              <li><Link to="/notice" className="transition-colors hover:text-white">Notice</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-5 font-serif text-lg font-bold">Support</h4>
            <ul className="space-y-3 text-white/60">
              <li><a href="#" className="transition-colors hover:text-white">Contact Us</a></li>
              <li><a href="#" className="transition-colors hover:text-white">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-5 font-serif text-lg font-bold">Newsletter</h4>
            <form onSubmit={handleSubscribe} className="space-y-3" noValidate>
              <label htmlFor="newsletter-email" className="sr-only">Email address</label>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status !== "idle") setStatus("idle");
                }}
                placeholder="Enter your email"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder:text-white/40"
              />
              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full rounded-lg bg-amber-500 py-2.5 font-bold text-ink-950 transition-colors hover:bg-amber-400 disabled:opacity-60"
              >
                {status === "sending" ? "Subscribing…" : "Subscribe"}
              </button>
              <div aria-live="polite" className="min-h-[1.25rem] text-sm">
                {status === "done" && (
                  <p className="flex items-center gap-1.5 text-emerald-400">
                    <Check className="h-4 w-4" /> সাবস্ক্রাইব সম্পন্ন হয়েছে
                  </p>
                )}
                {status === "error" && (
                  <p className="text-rose-300">সঠিক ইমেইল দিন, অথবা কিছুক্ষণ পর আবার চেষ্টা করুন।</p>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 text-center text-sm text-white/40">
          <p>© 2026 Premium Book Reader. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
