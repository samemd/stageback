import { Sidebar } from "~/components/sidebar";
import { fileRouter } from "~/app/api/uploadthing/core";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import PageWithAuth from "~/components/page-with-auth";
import dynamic from "next/dynamic";
import { type ReactNode, Suspense } from "react";

const AudioPlayer = dynamic(() => import("~/components/audio-player"));

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <Sidebar>
      <PageWithAuth>
        <NextSSRPlugin routerConfig={extractRouterConfig(fileRouter)} />
        {children}
        <Suspense>
          <AudioPlayer />
        </Suspense>
      </PageWithAuth>
    </Sidebar>
  );
}
