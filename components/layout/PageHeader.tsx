import { Container } from "@/components/layout/Container";

// Small header logo lockup shared by every screen after Home (Quiz-Start,
// Quiz-Question, Finish, Result frames all show this same smaller mark).
export function PageHeader() {
  return (
    <header className="flex w-full justify-center">
      <Container className="flex h-[56px] items-end justify-center desktop:h-[74px]">
        <div className="h-[32px] w-[190px] desktop:h-[42px] desktop:w-[250px]">
          {/* eslint-disable-next-line @next/next/no-img-element -- vector logo lockup, not a Next/Image candidate */}
          <img src="/images/home/home-logo.svg" alt="Dyninno | Trevolution" className="size-full" />
        </div>
      </Container>
    </header>
  );
}
