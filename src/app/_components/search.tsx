"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { api } from "~/trpc/react";
import { useEffect, useRef } from "react";
import SongList from "~/components/song/song-list";
import { defaultSongColumns } from "~/lib/default-song-columns";
import { debounce } from "~/lib/utils";
import { Input } from "~/components/ui/input";
import { HiSearch } from "react-icons/hi";
import usePlayer from "~/app/_hooks/use-player";
import { keepPreviousData } from "@tanstack/react-query";
import { type SongWithRelations } from "~/lib/types";

export default function Search() {
  const { setSpaceBarEnabled } = usePlayer();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);
  const q = searchParams.get("q");
  const { data: songs, isFetching } = api.song.search.useQuery(q, {
    enabled: Boolean(q),
    placeholderData: keepPreviousData,
  });

  // Focus the input element on component mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const debouncedSearch = debounce((value: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    if (!value) {
      current.delete("q");
    } else {
      current.set("q", value);
    }
    const search = current.toString();
    const query = search ? `?${search}` : "";

    window.history.pushState({}, "", `${pathname}${query}`);
  }, 300);

  const message = isFetching
    ? "Searching..."
    : Boolean(q)
      ? `No results found for "${q}"`
      : "Search for Songs, Albums or Artists";

  return (
    <div className="flex h-full w-full flex-col items-center gap-5">
      <div className="relative w-1/2">
        <Input
          ref={inputRef}
          type="search"
          name="q"
          className="bg-background h-12 rounded-full pl-10"
          defaultValue={q ?? undefined}
          onChange={(e) => debouncedSearch(e.target.value)}
          onFocus={() => setSpaceBarEnabled(false)}
          onBlur={() => setSpaceBarEnabled(true)}
        />
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <HiSearch className="h-5 w-5" />
        </div>
      </div>
      {songs?.length ? (
        <SongList
          columns={defaultSongColumns}
          songs={songs as SongWithRelations[]}
        />
      ) : (
        <div className="flex h-full flex-col items-center justify-center">
          <div>{message}</div>
        </div>
      )}
    </div>
  );
}
