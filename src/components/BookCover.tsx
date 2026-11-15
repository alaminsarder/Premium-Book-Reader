import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';

const gradients = [
  'from-amber-500 to-orange-600',
  'from-emerald-500 to-teal-700',
  'from-blue-500 to-indigo-700',
  'from-rose-500 to-pink-700',
  'from-violet-500 to-purple-700',
  'from-slate-600 to-slate-900',
];

const isPlaceholder = (src?: string) =>
  !src || /placeholder|placehold|no[+%20_ -]?image/i.test(src);

interface Props {
  src?: string;
  title: string;
  id: string | number;
  className?: string;
}

const BookCover: React.FC<Props> = ({ src, title, id, className = '' }) => {
  const [failed, setFailed] = useState(false);

  if (isPlaceholder(src) || failed) {
    const hash = String(id)
      .split('')
      .reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
    return (
      <div
        className={`w-full h-full bg-gradient-to-br ${gradients[hash % gradients.length]} flex flex-col items-center justify-center p-6 text-center text-white ${className}`}
      >
        <BookOpen className="h-10 w-10 mb-4 opacity-80" />
        <span className="font-bold text-lg leading-snug line-clamp-4">{title}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={title}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`w-full h-full object-cover ${className}`}
    />
  );
};

export default BookCover;