import { NextResponse, type NextRequest } from "next/server";

import {
  COOKIE,
  cookieOptions,
  decryptSession,
  encryptSession,
  IDLE_MS,
  needsRefresh,
} from "@/lib/auth/token";

const PROTECTED = ["/esims"];

export async function proxy(request: NextRequest) {
  const decoded = await decryptSession(request.cookies.get(COOKIE)?.value);
  const { pathname } = request.nextUrl;

  // Optimistic only. A token that decrypts may still have been revoked, so this
  // is not the access check — the page re-reads through the DAL. All this does
  // is stop an expired visitor from rendering an account shell they'll be
  // bounced out of anyway.
  if (!decoded && PROTECTED.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  const response = NextResponse.next();

  // Slide the idle window. Every request the user genuinely makes passes through
  // here, server actions included, which is why this replaced the client-side
  // ping that used to do it — that one missed anyone whose JS never ran.
  if (decoded && needsRefresh(decoded.tokenIssuedAt)) {
    response.cookies.set(COOKIE, await encryptSession(decoded.session), {
      ...cookieOptions,
      expires: new Date(Date.now() + IDLE_MS),
    });
  }

  return response;
}

export const config = {
  matcher: [
    {
      source:
        "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|images|videos|buttons).*)",
      // A prefetch is the browser guessing, not the user acting. Letting one
      // slide the idle window would keep an abandoned tab signed in forever.
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
