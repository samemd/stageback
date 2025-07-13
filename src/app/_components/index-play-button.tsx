"use client";

import usePlayer from "~/app/_hooks/usePlayer";
import { HiPause, HiPlay } from "react-icons/hi2";
import { type HTMLAttributes, type MouseEvent } from "react";
import { cn } from "~/lib/utils";
import { type SongWithRelations } from "~/lib/types";

type PlayButtonProps = HTMLAttributes<HTMLDivElement> & {
  index: number;
  song: SongWithRelations;
  size?: number;
};

export default function IndexPlayButton({
  index,
  song,
  size = 20,
  className,
}: PlayButtonProps) {
  const player = usePlayer();
  const isCurrentlyActive = player.activeSong?.id === song.id;

  function onClick(e: MouseEvent) {
    e.preventDefault();
    if (!isCurrentlyActive) player.setActiveSong(song);
    else player.togglePlay();
    if (player.tempIds.length) player.updateIds();
  }
  const Icon = isCurrentlyActive && player.isPlaying ? HiPause : HiPlay;

  return (
    <div className={cn("flex justify-center", className)}>
      {isCurrentlyActive ? (
        <Icon size={size} onClick={onClick} />
      ) : (
        <div>{index}</div>
      )}
    </div>
  );
}
