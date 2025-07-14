import "~/styles/globals.css";
import { Geist } from "next/font/google";
import { TRPCReactProvider } from "~/trpc/react";
import NextAuthProvider from "~/app/_providers/auth-provider";
import { type ReactNode } from "react";
import { ThemeProvider } from "~/app/_providers/theme-provider";
import { Toaster } from "~/components/ui/toaster";

export const metadata = {
  title: "StageBack",
  description: "The home for all your files",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${geist.variable}`}>
        <NextAuthProvider>
          <TRPCReactProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster />
            </ThemeProvider>
          </TRPCReactProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
