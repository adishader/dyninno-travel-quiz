// Static (non-parallax) version of the decorative world-map illustration.
// Home's own copy stays inline (it's cursor-parallax-animated); this is for
// screens that show the same map at rest, e.g. Result.
export function BackgroundMap({ zIndexClassName = "z-[1]" }: { zIndexClassName?: string }) {
  return (
    <div
      aria-hidden
      className={`absolute left-1/2 top-0 h-[306px] w-[787px] -translate-x-1/2 overflow-hidden desktop:h-[560px] desktop:w-[1440px] ${zIndexClassName}`}
    >
      <div className="absolute inset-[-22.32%_3.47%_0.54%_3.4%]">
        {/* eslint-disable-next-line @next/next/no-img-element -- decorative SVG illustration, not a Next/Image candidate */}
        <img src="/images/home/home-map-bg.svg" alt="" className="block size-full" />
      </div>
    </div>
  );
}
