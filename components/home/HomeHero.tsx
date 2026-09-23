"use client";

import Image from "next/image";
import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform, type Variants } from "framer-motion";
import { LinkButton } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";

const DESKTOP_QUERY = "(min-width: 1025px)";
const MAP_PARALLAX_PX = 5;
const HERO_PARALLAX_PX = 10;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut", delay },
  }),
};

export function HomeHero({
  locale,
  logoSrc,
  mapBgSrc,
  heroImageDeskSrc,
  heroImageMobSrc,
  label,
  title,
  description,
  buttonLabel,
}: {
  locale: string;
  logoSrc: string;
  mapBgSrc: string;
  heroImageDeskSrc: string;
  heroImageMobSrc: string;
  label: string;
  title: string;
  description: string;
  buttonLabel: string;
}) {
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
  const mapX = useSpring(useTransform(pointerX, [-0.5, 0.5], [MAP_PARALLAX_PX, -MAP_PARALLAX_PX]), springConfig);
  const mapY = useSpring(useTransform(pointerY, [-0.5, 0.5], [MAP_PARALLAX_PX, -MAP_PARALLAX_PX]), springConfig);
  const heroX = useSpring(useTransform(pointerX, [-0.5, 0.5], [HERO_PARALLAX_PX, -HERO_PARALLAX_PX]), springConfig);
  const heroY = useSpring(useTransform(pointerY, [-0.5, 0.5], [HERO_PARALLAX_PX, -HERO_PARALLAX_PX]), springConfig);

  return (
    <main className="relative isolate overflow-hidden bg-fill-white">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 z-[2] flex h-full w-full items-start justify-center gap-[230px] desktop:z-[1] desktop:gap-[407px]"
      >
        {Array.from({ length: 7 }).map((_, i) => (
          <span key={i} className="h-full w-[2px] bg-border-light" />
        ))}
      </div>

      <motion.div
        aria-hidden
        style={{ x: mapX, y: mapY }}
        className="absolute left-1/2 top-0 z-[1] h-[306px] w-[787px] -translate-x-1/2 overflow-hidden desktop:z-[2] desktop:h-[560px] desktop:w-[1440px]"
      >
        <div className="absolute inset-[-22.32%_3.47%_0.54%_3.4%]">
          {/* eslint-disable-next-line @next/next/no-img-element -- decorative SVG illustration, not a Next/Image candidate */}
          <img src={mapBgSrc} alt="" className="block size-full" />
        </div>
      </motion.div>

      <section className="relative z-[3] flex flex-col items-center">
        <Container className="flex flex-col items-center gap-[32px] py-[24px] desktop:flex-row desktop:justify-center desktop:py-[130px]">
          <motion.div
            initial="hidden"
            animate="visible"
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
              className="relative aspect-square w-full max-w-[542px] desktop:absolute desktop:left-0 desktop:top-[calc(50%+79px)] desktop:size-[860px] desktop:max-w-none desktop:-translate-y-1/2"
            >
              <Image
                src={heroImageMobSrc}
                alt=""
                fill
                priority
                className="block rounded-full object-cover desktop:hidden"
              />
              <Image
                src={heroImageDeskSrc}
                alt=""
                fill
                priority
                className="hidden rounded-full object-cover desktop:block"
              />
            </motion.div>
          </div>
        </Container>
      </section>
    </main>
  );
}
