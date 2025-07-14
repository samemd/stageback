"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import { HiEllipsisHorizontal } from "react-icons/hi2";
import Link from "next/link";
import useVersionConnector from "~/app/_hooks/use-version-connector";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { type Song } from ".prisma/client";

type SongActionsProps = {
  song: Song;
};

export default function SongActions({ song }: SongActionsProps) {
  const router = useRouter();
  const utils = api.useUtils();
  const { setSong, setIsOpen: setVersionModalOpen } = useVersionConnector();

  const { mutate: promote } = api.song.promoteToMainVersion.useMutation({
    onSuccess: (data) => {
      void utils.song.getMainVersions.invalidate();
      void utils.song.getAll.invalidate();
      void utils.song.getById.invalidate(song.id);
      router.replace(`/songs/${data.id}`);
      toast.success("Promoted to main Version!");
    },
  });

  return (
    <div className="flex justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 cursor-default p-0">
            <span className="sr-only">Open menu</span>
            <HiEllipsisHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Version</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem
              onSelect={() => {
                setSong(song);
                setVersionModalOpen(true);
              }}
            >
              Version of...
            </DropdownMenuItem>
            {song.versionOfId && (
              <DropdownMenuItem onSelect={() => promote({ id: song.id })}>
                Promote to main version
              </DropdownMenuItem>
            )}
            {song.versionOfId && (
              <DropdownMenuItem>Unlink version</DropdownMenuItem>
            )}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuSeparator />
          <DropdownMenuLabel>General</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(song.url)}
            >
              Copy file url
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={song.url} download rel="noopener noreferrer">
                Download
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
