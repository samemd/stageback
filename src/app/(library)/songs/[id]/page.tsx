import { api } from "~/trpc/server";
import SongDetails from "~/app/(library)/songs/[id]/song-details";
import { notFound } from "next/navigation";

export default async function AudioPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const song = await api.song.getById(params.id);

  if (!song) notFound();

  return <SongDetails id={params.id} initialSong={song} />;
}
