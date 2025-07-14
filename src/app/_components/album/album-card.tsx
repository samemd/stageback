import ImageWithFallback from "~/components/image-with-fallback";
import Link from "next/link";
import { type Album } from "@prisma/client";

export default function AlbumCard({ album }: { album: Album }) {
  return (
    <Link
      href={`/albums/${album.id}`}
      className="bg-muted hover:bg-accent flex cursor-pointer flex-col gap-4 rounded-md p-4"
    >
      <div className="relative aspect-square h-full w-full">
        <ImageWithFallback
          src={album.artworkUrl}
          alt="artwork"
          className="object-cover object-center"
          width={300}
          height={300}
          loading="lazy"
          sizes={"(min-width: 1024px) 25vw, 50vw"}
        />
      </div>
      <div>
        <div className="text-accent-foreground overflow-hidden text-sm font-bold whitespace-nowrap">
          {album.name}
        </div>
        <div className="flex gap-2 overflow-hidden text-sm font-light overflow-ellipsis whitespace-nowrap">
          <div>{album.year}</div>
          <div>{album.artist}</div>
        </div>
      </div>
    </Link>
  );
}
