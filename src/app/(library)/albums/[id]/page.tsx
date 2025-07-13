import { api } from "~/trpc/server";
import React from "react";
import { notFound } from "next/navigation";
import AlbumDetails from "~/app/(library)/albums/[id]/album-details";

export default async function AlbumPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const [album, songs] = await Promise.all([
    api.album.getById(params.id),
    api.song.getMainVersionsForAlbum(params.id),
  ]);

  if (!album) notFound();

  return (
    <AlbumDetails id={params.id} initialAlbum={album} initialSongs={songs} />
  );
}
