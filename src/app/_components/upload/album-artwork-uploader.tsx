import { api } from "~/trpc/react";
import { toast } from "sonner";
import React, { useCallback } from "react";
import { HiPlus } from "react-icons/hi2";
import { ImageUploader } from "~/components/upload/image-uploader";

interface AlbumArtworkUploaderProps {
  albumId: string;
}

export function AlbumArtworkUploader({ albumId }: AlbumArtworkUploaderProps) {
  const utils = api.useUtils();

  const { mutate: addArtwork } = api.album.addArtwork.useMutation();

  const onComplete = useCallback(
    (url: string, toastId?: string | number) => {
      addArtwork(
        { albumId, artworkUrl: url },
        {
          onSuccess: () => {
            void utils.album.getById.invalidate(albumId);
            void utils.album.getAll.invalidate();
            toast.success("Added Artwork!", { id: toastId });
          },
        },
      );
    },
    [addArtwork, albumId, utils.album.getAll, utils.album.getById],
  );

  return (
    <ImageUploader onClientUploadComplete={onComplete}>
      <HiPlus />
    </ImageUploader>
  );
}
