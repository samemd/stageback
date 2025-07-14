"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { defaultSongColumns } from "~/lib/default-song-columns";
import { Suspense } from "react";
import SongList from "~/app/_components/song/song-list";
import VersionConnector from "~/app/_components/song/version-connector";
import { type SongWithRelations } from "~/lib/types";
import { api } from "~/trpc/react";

type DataTableProps = {
  mainVersions: SongWithRelations[];
  allSongs: SongWithRelations[];
};

export function SongsPage({ allSongs, mainVersions }: DataTableProps) {
  const { data: all } = api.song.getAll.useQuery(undefined, {
    initialData: allSongs,
  });
  const { data: mains } = api.song.getMainVersions.useQuery(undefined, {
    initialData: mainVersions,
  });

  return (
    <div>
      <Tabs defaultValue="main" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="main">Main versions</TabsTrigger>
          <TabsTrigger value="all">All versions</TabsTrigger>
        </TabsList>
        <TabsContent value="main">
          <Suspense>
            <SongList songs={mains} columns={defaultSongColumns} />
          </Suspense>
        </TabsContent>
        <TabsContent value="all">
          <Suspense>
            <SongList songs={all} columns={defaultSongColumns} />
          </Suspense>
        </TabsContent>
      </Tabs>
      <VersionConnector />
    </div>
  );
}
