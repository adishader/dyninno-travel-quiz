"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { LinkButton } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";
import { BackgroundMap } from "@/components/layout/BackgroundMap";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { fadeUp } from "@/lib/animation/fadeUp";

const DESKTOP_QUERY = "(min-width: 1025px)";
const HERO_PARALLAX_PX = 10;
const HERO_COVER_MASK_SRC = "/images/home/hero-cover-mask.svg";

// Mask (not object-cover clipping) is what crops hero-cover-desk/mob into the
// circular hero-cover shape, per the Figma hero-cover frame — same technique
// as components/result/ResultCover.tsx.
const maskStyle = {
  maskImage: `url(${HERO_COVER_MASK_SRC})`,
  maskSize: "contain",
  maskRepeat: "no-repeat",
  maskPosition: "center",
  WebkitMaskImage: `url(${HERO_COVER_MASK_SRC})`,
  WebkitMaskSize: "contain",
  WebkitMaskRepeat: "no-repeat",
  WebkitMaskPosition: "center",
} as const;

export function HomeHero({
  locale,
  logoSrc,
  heroVideoDeskSrc,
  heroVideoMobSrc,
  label,
  title,
  description,
  buttonLabel,
}: {
  locale: string;
  logoSrc: string;
  heroVideoDeskSrc: string;
  heroVideoMobSrc: string;
  label: string;
  title: string;
  description: string;
  buttonLabel: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  useEffect(() => {
    const mql = window.matchMedia(DESKTOP_QUERY);
    if (!mql.matches) return;

    const handleMove = (event: MouseEvent) => {
      pointerX.set(event.clientX / window.innerWidth - 0.5);
      pointerY.set(event.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [pointerX, pointerY]);

  const springConfig = { stiffness: 60, damping: 20 };
  const heroX = useSpring(useTransform(pointerX, [-0.5, 0.5], [HERO_PARALLAX_PX, -HERO_PARALLAX_PX]), springConfig);
  const heroY = useSpring(useTransform(pointerY, [-0.5, 0.5], [HERO_PARALLAX_PX, -HERO_PARALLAX_PX]), springConfig);

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-fill-white">
      <LoadingScreen onDone={() => setLoaded(true)} />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 z-[2] flex h-full w-full items-start justify-center gap-[230px] desktop:z-[1] desktop:gap-[407px]"
      >
        {Array.from({ length: 7 }).map((_, i) => (
          <span key={i} className="h-full w-[2px] bg-border-light" />
        ))}
      </div>

      <BackgroundMap zIndexClassName="z-[1] desktop:z-[2]" />

      <section className="relative z-[3] flex w-full flex-1 flex-col items-center">
        <Container className="flex flex-col items-center gap-[32px] py-[24px] desktop:flex-row desktop:justify-center desktop:py-[130px]">
          <motion.div
            initial="hidden"
            animate={loaded ? "visible" : "hidden"}
            className="flex w-full max-w-[407px] flex-col items-center gap-[56px] desktop:max-w-none desktop:flex-1 desktop:items-start desktop:gap-[74px]"
          >
            <motion.div custom={0} variants={fadeUp} className="h-[42px] w-[250px] desktop:h-[56px] desktop:w-[334px]">
              {/* eslint-disable-next-line @next/next/no-img-element -- vector logo lockup, not a Next/Image candidate */}
              <img src={logoSrc} alt="Dyninno | Trevolution" className="size-full" />
            </motion.div>
            <div className="flex w-full flex-col items-center gap-[24px] desktop:items-start desktop:gap-[32px]">
              <motion.div
                custom={0.1}
                variants={fadeUp}
                className="flex h-[32px] items-center justify-center rounded-[10px] bg-[linear-gradient(90deg,#00b2a9_0%,#0060b2_100%)] px-[13px] text-mobile-body-regular-bold text-text-white desktop:h-[42px] desktop:rounded-[13px] desktop:px-[18px] desktop:text-desktop-body-regular-bold"
              >
                {label}
              </motion.div>
              <motion.h1
                custom={0.2}
                variants={fadeUp}
                className="w-full text-center text-mobile-heading-h2 text-text-primary desktop:text-left desktop:text-desktop-heading-h2"
              >
                {title}
              </motion.h1>
              <motion.p
                custom={0.3}
                variants={fadeUp}
                className="w-full text-center text-mobile-body-regular-bold text-[#242831] desktop:max-w-[542px] desktop:text-left desktop:text-desktop-body-regular-bold desktop:text-text-primary"
              >
                {description}
              </motion.p>
              <motion.div custom={0.4} variants={fadeUp} className="w-full desktop:w-auto">
                <LinkButton
                  href={`/${locale}/start`}
                  className="h-[74px] w-full justify-center rounded-[24px] px-[32px] text-center text-mobile-body-regular-bold desktop:h-[98px] desktop:w-auto desktop:rounded-[42px] desktop:px-[56px] desktop:text-desktop-body-regular-bold"
                >
                  {buttonLabel}
                </LinkButton>
              </motion.div>
            </div>
          </motion.div>

          <div className="flex w-full justify-center desktop:relative desktop:h-[558px] desktop:flex-1 desktop:justify-start">
            <motion.div
              style={{ x: heroX, y: heroY }}
              className="relative aspect-square w-full max-w-[540px] overflow-hidden desktop:absolute desktop:left-0 desktop:top-[calc(50%+79px)] desktop:size-[860px] desktop:max-w-none desktop:-translate-y-1/2"
            >
              <div className="absolute inset-0" style={maskStyle}>
                <video
                  className="absolute inset-0 block size-full object-cover desktop:hidden"
                  src={heroVideoMobSrc}
                  autoPlay
                  loop
                  muted
                  playsInline
                  aria-hidden
                />
                <video
                  className="absolute inset-0 hidden size-full object-cover desktop:block"
                  src={heroVideoDeskSrc}
                  autoPlay
                  loop
                  muted
                  playsInline
                  aria-hidden
                />
              </div>
            </motion.div>
          </div>
        </Container>
      </section>
    </main>
  );
}
