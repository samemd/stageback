"use client";

import { api } from "~/trpc/react";
import ImageWithFallback from "~/components/image-with-fallback";
import React, { Suspense } from "react";
import usePlayer from "~/app/_hooks/use-player";
import SongList from "~/components/song/song-list";
import { type ColumnDef } from "@tanstack/react-table";
import { formatDuration } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { HiPause, HiPlay } from "react-icons/hi2";
import SongActions from "~/components/song/song-actions";
import IndexPlayButton from "~/components/player/index-play-button";
import SongTitle from "~/components/song/song-title";
import dynamic from "next/dynamic";
import { type SongWithRelations } from "~/lib/types";
import { toast } from "sonner";
import { SongArtworkUploader } from "~/components/upload/song-artwork-uploader";

const VersionConnector = dynamic(
  () => import("~/components/song/version-connector"),
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
};

export default function SongDetails({ id }: SongDetailsProps) {
  const player = usePlayer();
  const utils = api.useUtils();

  const [song] = api.song.getById.useSuspenseQuery(id);

  const { mutate: deleteArtwork } = api.song.removeArtwork.useMutation({
    onSuccess: () => {
      void utils.song.getById.invalidate(id);
      toast.success("Artwork removed!");
    },
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
          onDelete={() => deleteArtwork({ songId: song.id })}
          actionButton={<SongArtworkUploader songId={id} />}
          priority
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
