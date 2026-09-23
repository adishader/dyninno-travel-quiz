import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, locales } from "@/lib/i18n/locales";

// The quiz has no in-app language switcher (EN/ES are separate links, per CLAUDE.md);
// this only gives "/" and other unprefixed paths a sane default of /en.
function hasLocalePrefix(pathname: string): boolean {
  return locales.some((locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`));
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (hasLocalePrefix(pathname)) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico|.*\\..*).*)"],
};
