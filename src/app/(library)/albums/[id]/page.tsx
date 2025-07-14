import { api, HydrateClient } from "~/trpc/server";
import React from "react";
import AlbumDetails from "~/app/(library)/albums/[id]/album-details";

export default async function AlbumPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  void Promise.all([
    api.album.getById.prefetch(params.id),
    api.song.getMainVersionsForAlbum.prefetch(params.id),
  ]);

  return (
    <HydrateClient>
      <AlbumDetails id={params.id} />
    </HydrateClient>
  );
}
