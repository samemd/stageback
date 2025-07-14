import { api, HydrateClient } from "~/trpc/server";
import SongDetails from "~/app/(library)/songs/[id]/song-details";

export default async function AudioPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  void api.song.getById.prefetch(params.id);

  return (
    <HydrateClient>
      <SongDetails id={params.id} />
    </HydrateClient>
  );
}
