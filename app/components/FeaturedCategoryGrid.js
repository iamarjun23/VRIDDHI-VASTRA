import Link from "next/link"
import Image from "next/image"

export default function FeaturedCategoryGrid({ blocks = [] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-[clamp(1rem,3vw,4rem)]">
      {blocks.map((block, i) => {
        const categoryName = block.title || `Category ${i + 1}`;
        const img = block.image || "";

        return (
          <div key={i} className="flex flex-col items-center">
            <div className="mb-4 sm:mb-6 flex justify-center">
              <Image
                src="/images/Lotus.png"
                alt=""
                role="presentation"
                width={128}
                height={128}
                loading="lazy"
                className="w-auto h-[clamp(56px,8vw,128px)] object-contain"
              />
            </div>

            <Link href={`/tags?category=${encodeURIComponent(categoryName)}#archive`} className="flex flex-col items-center group w-full dynamic-title-container">
              <div className="overflow-hidden bg-[#e5e0d8] relative mb-2 shadow-md group-hover:shadow-xl transition-all duration-700 w-[75%] sm:w-[95%] mx-auto aspect-[3/6] rounded-t-full">
                {img ? (
                  <Image
                    src={img}
                    alt={categoryName}
                    fill
                    sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 20vw"
                    className="object-cover transform transition-transform duration-1000 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-brand-green/5 flex items-center justify-center text-brand-green/20 uppercase tracking-widest text-[clamp(7px,0.8vw,10px)]">
                    {categoryName}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 sm:group-hover:bg-black/15 transition-colors duration-500" />
              </div>

              <h4 className="font-dm-sans text-[clamp(10px,1.6vw,23px)] tracking-[0.1em] text-brand-green group-hover:text-brand-gold transition-colors duration-300 uppercase mt-1 px-1 text-center w-full">
                {categoryName}
              </h4>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
