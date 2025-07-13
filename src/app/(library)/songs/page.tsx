import { api } from "~/trpc/server";
import { SongsPage } from "~/app/(library)/songs/songs-page";

export default async function Page() {
  const [all, mains] = await Promise.all([
    api.song.getAll(),
    api.song.getMainVersions(),
  ]);

  return <SongsPage allSongs={all} mainVersions={mains} />;
}
