"use client";

import { api } from "~/trpc/react";
import ImageWithFallback from "~/components/image-with-fallback";
import { Button } from "~/components/ui/button";
import { HiPlay } from "react-icons/hi2";
import React, { Suspense } from "react";
import { notFound } from "next/navigation";
import { type SongWithRelations } from "~/lib/types";
import usePlayer from "~/app/_hooks/use-player";
import { type ColumnDef } from "@tanstack/react-table";
import { formatDuration } from "~/lib/utils";
import SongActions from "~/components/song/song-actions";
import IndexPlayButton from "~/components/player/index-play-button";
import SongTitle from "~/components/song/song-title";
import dynamic from "next/dynamic";
import SongList from "~/components/song/song-list";
import { toast } from "sonner";
import { AlbumArtworkUploader } from "~/components/upload/album-artwork-uploader";

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
    header: "Title",
    accessorKey: "title",
    size: 200,
    cell: ({ row }) => <SongTitle song={row.original} />,
  },
  {
    header: () => <div className="text-right">Duration</div>,
    accessorKey: "duration",
    size: 10,
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

type AlbumDetailsProps = {
  id: string;
};

export default function AlbumDetails({ id }: AlbumDetailsProps) {
  const utils = api.useUtils();
  const player = usePlayer();
  const [album] = api.album.getById.useSuspenseQuery(id);
  const [songs] = api.song.getMainVersionsForAlbum.useSuspenseQuery(id);

  const { mutate: deleteArtwork } = api.album.removeArtwork.useMutation({
    onSuccess: () => {
      void utils.album.getById.invalidate(id);
      toast.success("Artwork removed!");
    },
  });

  if (!album) notFound();

  return (
    <div className="flex w-full flex-col gap-16">
      <div className="flex w-full flex-row gap-10">
        <ImageWithFallback
          src={album.artworkUrl}
          alt={"artwork"}
          width={300}
          height={300}
          className="aspect-square rounded-md object-cover"
          onDelete={() => deleteArtwork({ albumId: id })}
          actionButton={<AlbumArtworkUploader albumId={id} />}
          priority
        />

        <div className="flex cursor-default flex-col items-start justify-end">
          <h1 className="text-xl font-bold">{album.name}</h1>
          <h3 className="pb-10 text-sm font-medium">{album.artist}</h3>
          <Button
            onClick={() => {
              player.setActiveSong(songs[0]);
              player.setIsPlaying(true);
            }}
            className="gap-2"
          >
            <HiPlay size={20} />
            <span>Play</span>
          </Button>
        </div>
      </div>
      {!!songs.length && <SongList songs={songs} columns={columns} />}
      <Suspense>
        <VersionConnector />
      </Suspense>
    </div>
  );
}
