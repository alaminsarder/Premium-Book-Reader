import React from "react";
import { cn } from "../utils/cn";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  /** Extra bottom padding so content below can overlap the hero. */
  overlap?: boolean;
  children?: React.ReactNode;
}

const PageHero: React.FC<PageHeroProps> = ({ title, subtitle, overlap = false, children }) => (
  <header className="relative overflow-hidden bg-ink-950 text-white">
    <div
      aria-hidden
      className="absolute inset-0 bg-[radial-gradient(48rem_24rem_at_88%_-12%,rgba(245,158,11,0.24),transparent_62%)]"
    />
    <div
      aria-hidden
      className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(to_right,#fff_1px,transparent_1px)] [background-size:56px_100%]"
    />
    <div
      className={cn(
        "relative mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-8",
        overlap ? "pb-44" : "pb-14"
      )}
    >
      <h1 className="max-w-2xl font-serif text-4xl font-bold leading-[1.35] sm:text-5xl sm:leading-[1.3]">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/70">{subtitle}</p>
      )}
      {children}
    </div>
  </header>
);

export default PageHero;
