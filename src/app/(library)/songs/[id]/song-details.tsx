"use client";

import { api, type RouterOutputs } from "~/trpc/react";
import ImageWithFallback from "~/components/image-with-fallback";
import React from "react";
import usePlayer from "~/app/_hooks/usePlayer";
import SongList from "~/components/song-list";
import { type ColumnDef } from "@tanstack/react-table";
import { formatDuration } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { HiPause, HiPlay } from "react-icons/hi2";
import SongActions from "~/components/song-actions";
import IndexPlayButton from "~/components/index-play-button";
import SongTitle from "~/components/song-title";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { type SongWithRelations } from "~/lib/types";

const VersionConnector = dynamic(
  () => import("~/components/version-connector"),
);

const columns: ColumnDef<SongWithRelations>[] = [
  {
    header: () => <div className="sr-only">Index</div>,
    accessorFn: (_, index) => index + 1,
    id: "index",
    size: 1,
    cell: ({ row }) => (
      <IndexPlayButton song={row.original} index={row.getValue("index")} />
    ),
  },
  {
    header: "Version",
    accessorKey: "title",
    size: 150,
    cell: ({ row }) => <SongTitle song={row.original} />,
  },
  {
    header: () => <div className="text-right">Duration</div>,
    accessorKey: "duration",
    size: 50,
    cell: ({ row }) => (
      <div className="text-right">
        {formatDuration(row.getValue("duration") ?? 0)}
      </div>
    ),
  },
  {
    id: "actions",
    size: 5,
    cell: ({ row }) => <SongActions song={row.original} />,
  },
];

type SongDetailsProps = {
  id: string;
  initialSong: NonNullable<RouterOutputs["song"]["getById"]>;
};

export default function SongDetails({ initialSong, id }: SongDetailsProps) {
  const player = usePlayer();
  const { data: song } = api.song.getById.useQuery(id, {
    initialData: initialSong,
  });

  if (!song) return null;

  const isPlaying = player.activeSong?.id === song.id && player.isPlaying;

  function togglePlay() {
    if (!song) return;
    if (player.activeSong?.id === song.id) {
      player.togglePlay();
    } else {
      player.setActiveSong(song);
      player.setIsPlaying(true);
    }
  }

  return (
    <div className="flex w-full flex-col gap-16">
      <div className="flex w-full flex-row gap-10">
        <ImageWithFallback
          src={song.artworkUrl ?? song.album?.artworkUrl}
          alt={"artwork"}
          width={300}
          height={300}
          className="aspect-square rounded-md object-cover"
        />

        <div className="flex cursor-default flex-col items-start justify-end">
          <h1 className="text-xl font-bold">{song.title}</h1>
          <h3 className="pb-10 text-sm font-medium">{song.artist}</h3>
          <Button onClick={togglePlay} className="gap-2">
            {isPlaying ? <HiPause size={20} /> : <HiPlay size={20} />}
            <span>Main Version</span>
          </Button>
        </div>
      </div>
      <Suspense>
        <SongList songs={song.versions} columns={columns} />
        <VersionConnector />
      </Suspense>
    </div>
  );
}
