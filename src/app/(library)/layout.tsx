import { Sidebar } from "~/components/layout/sidebar";
import { fileRouter } from "~/app/api/uploadthing/core";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import PageWithAuth from "~/components/layout/page-with-auth";
import { type ReactNode } from "react";
import AudioPlayer from "~/components/player/audio-player";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <Sidebar>
      <PageWithAuth>
        <NextSSRPlugin routerConfig={extractRouterConfig(fileRouter)} />
        {children}
        <AudioPlayer />
      </PageWithAuth>
    </Sidebar>
  );
}
