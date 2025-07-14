import { api } from "~/trpc/react";
import { toast } from "sonner";
import React, { useCallback } from "react";
import { HiPlus } from "react-icons/hi2";
import { ImageUploader } from "~/components/upload/image-uploader";

interface SongArtworkUploaderProps {
  songId: string;
}

export function SongArtworkUploader({ songId }: SongArtworkUploaderProps) {
  const utils = api.useUtils();

  const { mutate: addArtwork } = api.song.addArtwork.useMutation();

  const onComplete = useCallback(
    (url: string, toastId?: string | number) => {
      addArtwork(
        { songId, artworkUrl: url },
        {
          onSuccess: () => {
            void utils.song.getById.invalidate(songId);
            toast.success("Added Artwork!", { id: toastId });
          },
        },
      );
    },
    [addArtwork, songId, utils.song.getById],
  );

  return (
    <ImageUploader onClientUploadComplete={onComplete}>
      <HiPlus />
    </ImageUploader>
  );
}
