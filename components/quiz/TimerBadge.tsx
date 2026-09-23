export function TimerBadge({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-[2px] rounded-[13px] bg-fill-grey-pale px-[10px] py-[8px] text-mobile-body-small-bold text-[#242831] desktop:rounded-[18px] desktop:px-[13px] desktop:py-[10px] desktop:text-desktop-body-small-bold">
      {/* eslint-disable-next-line @next/next/no-img-element -- small static icon, not a Next/Image candidate */}
      <img src="/images/other/ic-timer.svg" alt="" className="size-[18px] desktop:size-[24px]" />
      <span>{label}</span>
    </div>
  );
}
