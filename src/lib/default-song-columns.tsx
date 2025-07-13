import { type Column, type ColumnDef } from "@tanstack/react-table";
import { type SongWithRelations } from "~/lib/types";
import IndexPlayButton from "~/components/index-play-button";
import Link from "next/link";
import { formatDuration } from "~/lib/utils";
import React from "react";
import SongActions from "~/components/song-actions";
import ImageWithFallback from "~/components/image-with-fallback";
import SongTitle from "~/components/song-title";
import { HiChevronDown, HiChevronUp } from "react-icons/hi2";

const headerWithSorting =
  (name: string) =>
  // eslint-disable-next-line react/display-name
  ({ column }: { column: Column<SongWithRelations> }) => {
    const isSorted = column.getIsSorted();
    const Icon = column.getIsSorted() === "asc" ? HiChevronUp : HiChevronDown;
    function onClick() {
      if (column.getIsSorted() === "desc") {
        column.clearSorting();
      } else {
        column.toggleSorting(column.getIsSorted() === "asc", true);
      }
    }
    return (
      <div className="flex cursor-pointer" onClick={onClick}>
        {name}
        {isSorted && <Icon className="ml-2 h-4 w-4" />}
      </div>
    );
  };

export const defaultSongColumns: ColumnDef<SongWithRelations>[] = [
  {
    id: "index",
    header: () => <div className="sr-only">Play button</div>,
    size: 25,
    // accessorFn: (_, index) => index + 1,
    cell: ({ row, table }) => {
      const index =
        table
          .getSortedRowModel()
          ?.flatRows?.findIndex((flatRow) => flatRow.id === row.id) + 1;
      return (
        <div className="flex justify-center">
          <IndexPlayButton song={row.original} index={index} />
        </div>
      );
    },
  },
  {
    id: "artwork",
    header: () => <div className="sr-only">Artwork</div>,
    size: 25,
    cell: ({ row }) => (
      <ImageWithFallback
        src={row.original.artworkUrl ?? row.original.album?.artworkUrl}
        alt={"artwork"}
        width={40}
        height={40}
        quality={70}
        className="aspect-square rounded-sm object-cover"
      />
    ),
  },
  {
    header: headerWithSorting("Title"),
    accessorKey: "title",
    size: 100,
    cell: ({ row }) => <SongTitle song={row.original} />,
  },
  {
    header: headerWithSorting("Album"),
    accessorKey: "album.name",
    size: 100,
    cell: ({ row }) => {
      if (!row.original.albumId) return null;
      return (
        <div className="truncate">
          <Link
            className="hover:underline"
            href={`/albums/${row.original.albumId}`}
          >
            {row.original.album?.name}
          </Link>
        </div>
      );
    },
  },
  {
    header: "Duration",
    accessorKey: "duration",
    size: 25,
    cell: ({ row }) => (
      <div className="text-center">
        {formatDuration(row.getValue("duration") ?? 0)}
      </div>
    ),
  },
  {
    id: "actions",
    size: 25,
    cell: ({ row }) => <SongActions song={row.original} />,
  },
];
