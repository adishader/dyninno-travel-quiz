import Image from "next/image";

// The mask shape is breakpoint-specific (Figma: separate mask SVGs per
// frame), so this renders two stacked, breakpoint-toggled masked layers
// rather than one fluid mask — same pattern as the Home hero image swap.
function MaskedPhoto({ maskSrc, photoSrc, className }: { maskSrc: string; photoSrc: string; className: string }) {
  return (
    <div
      className={`absolute inset-0 ${className}`}
      style={{
        maskImage: `url(${maskSrc})`,
        maskSize: "contain",
        maskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskImage: `url(${maskSrc})`,
        WebkitMaskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
      }}
    >
      <Image src={photoSrc} alt="" fill priority className="object-cover" />
    </div>
  );
}

export function ResultCover({ photoSrc }: { photoSrc: string }) {
  return (
    <div className="relative aspect-[460/306] w-full max-w-[345.75px] shrink-0 overflow-hidden desktop:h-[306px] desktop:w-[460px] desktop:max-w-none">
      <MaskedPhoto
        maskSrc="/images/result/result-cover-mask-mob.svg"
        photoSrc={photoSrc}
        className="block desktop:hidden"
      />
      <MaskedPhoto
        maskSrc="/images/result/result-cover-mask-desk.svg"
        photoSrc={photoSrc}
        className="hidden desktop:block"
      />
    </div>
  );
}
