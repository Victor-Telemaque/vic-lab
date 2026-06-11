import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { defaultSiteLocale } from "@/lib/site-config";

function resolvePreferredLocale(acceptLanguage: string | null): "fr" | "en" {
  if (!acceptLanguage) {
    return defaultSiteLocale;
  }

  const languages = acceptLanguage
    .split(",")
    .map((entry) => entry.trim().split(";")[0]?.toLowerCase() ?? "");

  if (languages.some((language) => language.startsWith("en"))) {
    return "en";
  }

  return defaultSiteLocale;
}

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname !== "/") {
    return NextResponse.next();
  }

  const locale = resolvePreferredLocale(request.headers.get("accept-language"));
  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = `/${locale}`;

  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: "/",
};
