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
  heroImageSrc,
  label,
  title,
  description,
  buttonLabel,
}: {
  locale: string;
  logoSrc: string;
  mapBgSrc: string;
  heroImageSrc: string;
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
        className="absolute inset-x-0 top-0 z-[1] flex h-[560px] w-full items-start justify-center gap-[407px]"
      >
        {Array.from({ length: 7 }).map((_, i) => (
          <span key={i} className="h-full w-[2px] bg-border-light" />
        ))}
      </div>

      <motion.div
        aria-hidden
        style={{ x: mapX, y: mapY }}
        className="absolute left-1/2 top-0 z-[2] h-[560px] w-[1440px] -translate-x-1/2 overflow-hidden"
      >
        <div className="absolute inset-[-22.32%_3.47%_0.54%_3.4%]">
          {/* eslint-disable-next-line @next/next/no-img-element -- decorative SVG illustration, not a Next/Image candidate */}
          <img src={mapBgSrc} alt="" className="block size-full" />
        </div>
      </motion.div>

      <section className="relative z-[3] flex flex-col items-center">
        <Container className="flex items-center justify-center gap-[32px] py-[130px]">
          <motion.div initial="hidden" animate="visible" className="flex flex-1 flex-col items-start gap-[74px]">
            <motion.div custom={0} variants={fadeUp} className="h-[56px] w-[334px]">
              {/* eslint-disable-next-line @next/next/no-img-element -- vector logo lockup, not a Next/Image candidate */}
              <img src={logoSrc} alt="Dyninno | Trevolution" className="size-full" />
            </motion.div>
            <div className="flex w-full flex-col items-start gap-[32px]">
              <motion.div
                custom={0.1}
                variants={fadeUp}
                className="flex h-[42px] items-center justify-center rounded-[13px] bg-[linear-gradient(90deg,#00b2a9_0%,#0060b2_100%)] px-[18px] text-desktop-body-regular-bold text-text-white"
              >
                {label}
              </motion.div>
              <motion.h1 custom={0.2} variants={fadeUp} className="w-full text-desktop-heading-h2 text-text-primary">
                {title}
              </motion.h1>
              <motion.p
                custom={0.3}
                variants={fadeUp}
                className="max-w-[542px] text-desktop-body-regular-bold text-text-primary"
              >
                {description}
              </motion.p>
              <motion.div custom={0.4} variants={fadeUp}>
                <LinkButton href={`/${locale}/start`}>{buttonLabel}</LinkButton>
              </motion.div>
            </div>
          </motion.div>

          <div className="relative h-[558px] flex-1">
            <motion.div
              style={{ x: heroX, y: heroY }}
              className="absolute left-0 top-[calc(50%+79px)] size-[860px] -translate-y-1/2"
            >
              <Image src={heroImageSrc} alt="" fill priority className="rounded-full object-cover" />
            </motion.div>
          </div>
        </Container>
      </section>
    </main>
  );
}
