// The mask shape is breakpoint-specific (Figma: separate mask SVGs per
// frame), so this renders two stacked, breakpoint-toggled masked layers
// rather than one fluid mask — same pattern as the Home hero video.
function MaskedVideo({ maskSrc, videoSrc, className }: { maskSrc: string; videoSrc: string; className: string }) {
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
      <video
        className="absolute inset-0 size-full object-cover"
        src={videoSrc}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden
      />
    </div>
  );
}

export function ResultCover({ videoSrc }: { videoSrc: string }) {
  return (
    // mx-auto: this sits inside a `w-full` fade-in wrapper (see ResultScreen),
    // not directly as a flex child of the centered column like in Figma, so it
    // needs its own centering rather than inheriting items-center from a
    // grandparent — without it the block hugs the left edge whenever its
    // parent is wider than this block's own max-width (e.g. tablet-width
    // "mobile" layouts, or desktop's fixed 460px inside a wider column).
    <div className="relative mx-auto aspect-[460/306] w-full max-w-[345.75px] shrink-0 overflow-hidden desktop:h-[306px] desktop:w-[460px] desktop:max-w-none">
      <MaskedVideo
        maskSrc="/images/result/result-cover-mask-mob.svg"
        videoSrc={videoSrc}
        className="block desktop:hidden"
      />
      <MaskedVideo
        maskSrc="/images/result/result-cover-mask-desk.svg"
        videoSrc={videoSrc}
        className="hidden desktop:block"
      />
    </div>
  );
}
