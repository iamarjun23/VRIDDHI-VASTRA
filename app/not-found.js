import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F1E8CD] text-[#1c1410] px-4">
      <h2 className="font-display text-6xl mb-4 text-[#103323]">404</h2>
      <h3 className="font-dm-sans text-2xl mb-4 tracking-widest uppercase text-[#103323]">Page Not Found</h3>
      <p className="font-dm-sans text-lg mb-8 opacity-70 max-w-md text-center">The piece you are looking for does not exist or has been moved from our archive.</p>
      <Link href="/" className="px-8 py-3 bg-[#103323] text-white rounded-full text-sm tracking-widest uppercase hover:bg-opacity-90 transition-all">
        Return to Home
      </Link>
    </div>
  );
}
