'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFFAEE] text-[#1c1410] px-4">
      <h2 className="font-display text-4xl mb-4 text-[#103323]">Something went wrong!</h2>
      <p className="font-dm-sans text-lg mb-8 opacity-70">We couldn't load this page.</p>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="px-6 py-2 bg-[#103323] text-white rounded-full text-sm tracking-widest uppercase hover:bg-opacity-90 transition-all"
        >
          Try again
        </button>
        <Link href="/" className="px-6 py-2 border border-[#103323] text-[#103323] rounded-full text-sm tracking-widest uppercase hover:bg-[#103323] hover:text-white transition-all">
          Go Home
        </Link>
      </div>
    </div>
  );
}
