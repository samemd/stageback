export { auth as middleware } from "~/server/auth";

export const config = {
  matcher: [
    "/((?!api|_next|_vercel|assets|auth/signin|auth/verify-request).*)*",
  ],
};

export const runtime = "experimental-edge";
