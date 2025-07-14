"use client";

import { ImSpinner2 } from "react-icons/im";
import { HiPause, HiPlay } from "react-icons/hi";
import * as React from "react";
import { type RefObject, useEffect, useState } from "react";
import usePlayer from "~/app/_hooks/use-player";
import { Button } from "~/components/ui/button";
import { BsFillSkipEndFill, BsFillSkipStartFill } from "react-icons/bs";
import { api } from "~/trpc/react";

type PlayerControlsProps = { audioRef: RefObject<HTMLAudioElement | null> };

export default function PlayerControls({ audioRef }: PlayerControlsProps) {
  const player = usePlayer();
  const [isReady, setIsReady] = useState(false);
  const { data: next } = api.song.getById.useQuery(player.ids[1]!, {
    enabled: player.ids[1] !== undefined,
  });

  useEffect(() => {
    if (!audioRef.current) return;
    const audioElement = audioRef.current;

    let loadStartTimeout: NodeJS.Timeout;

    const handleCanPlay = () => {
      clearTimeout(loadStartTimeout);
      setIsReady(true);
    };

    const handleLoadStart = () => {
      loadStartTimeout = setTimeout(() => {
        setIsReady(false);
      }, 200);
    };

    audioElement.addEventListener("canplaythrough", handleCanPlay);
    audioElement.addEventListener("loadstart", handleLoadStart);

    return () => {
      audioElement.removeEventListener("canplaythrough", handleCanPlay);
      audioElement.removeEventListener("loadstart", handleLoadStart);
    };
  }, [audioRef]);

  const handleNext = () => {
    if (!next) return;
    player.setActiveSong(next);
  };

  return (
    <div className="flex items-center justify-center gap-4">
      <Button variant="player" className="h-7 w-7 p-0">
        <BsFillSkipStartFill className="text-muted-foreground hover:text-accent-foreground h-full w-full" />
      </Button>
      <Button
        disabled={!isReady}
        onClick={player.togglePlay}
        aria-label={player.isPlaying ? "Pause" : "Play"}
        size="icon"
        variant="player"
      >
        {!isReady ? (
          <ImSpinner2 className="h-full w-full animate-spin p-1" />
        ) : player.isPlaying ? (
          <HiPause className="h-full w-full" />
        ) : (
          <HiPlay className="h-full w-full" />
        )}
      </Button>

      <Button
        disabled={!next}
        onClick={handleNext}
        variant="player"
        className="h-7 w-7 p-0"
      >
        <BsFillSkipEndFill className="text-muted-foreground hover:text-accent-foreground h-full w-full" />
      </Button>
    </div>
  );
}
