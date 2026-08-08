import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { checkSession } from "@/lib/api/serverApi";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );

  let isAuthenticated = Boolean(accessToken);
  const response = NextResponse.next();

  if (!isAuthenticated && refreshToken) {
    try {
      const apiRes = await checkSession(request.headers.get("cookie") ?? "");
      const setCookie = apiRes.headers["set-cookie"];

      if (setCookie) {
        const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];

        for (const cookieStr of cookieArray) {
          response.headers.append("set-cookie", cookieStr);
        }

        isAuthenticated = cookieArray.some((cookieStr) =>
          cookieStr.startsWith("accessToken="),
        );
      }
    } catch {
      isAuthenticated = false;
    }
  }

  if (!isAuthenticated && isPrivateRoute) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (isAuthenticated && isPublicRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
