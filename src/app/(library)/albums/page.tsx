import { api } from "~/trpc/server";
import AlbumCard from "~/components/album-card";

export default async function Page() {
  const albums = await api.album.getAll();

  return (
    <div className="grid w-full grid-cols-2 gap-x-4 gap-y-6 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-8">
      {albums.map((album) => (
        <AlbumCard key={album.id} album={album} />
      ))}
    </div>
  );
}
