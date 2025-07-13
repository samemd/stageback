"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { HiVolumeOff, HiVolumeUp } from "react-icons/hi";
import AudioProgressBar from "~/components/audio-progress-bar";
import VolumeInput from "~/components/volume-input";
import TitleScroller from "~/components/title-scroller";
import PlayerControls from "~/components/player-controls";
import usePlayer from "~/app/_hooks/usePlayer";
import { HiXMark } from "react-icons/hi2";
import { Button } from "~/components/ui/button";
import ImageWithFallback from "~/components/image-with-fallback";

export default function AudioPlayer() {
  const { activeSong, ...player } = usePlayer();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [volume, setVolume] = useState(0.8);
  const [previousVolume, setPreviousVolume] = useState(0);

  // load new track
  useEffect(() => {
    if (!audioRef.current || !activeSong) return;
    audioRef.current.load();
    void audioRef.current.play();
    player.setIsPlaying(true);
  }, [activeSong]);

  // handle play/pause
  useEffect(() => {
    if (!audioRef.current) return;
    if (player.isPlaying) {
      return void audioRef.current.play();
    }
    return audioRef.current.pause();
  }, [player.isPlaying]);

  // use space bar to play/pause
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && player.spaceBarEnabled) {
        player.togglePlay();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [player.togglePlay, player.spaceBarEnabled]);

  // use media keys to play/pause
  useEffect(() => {
    // Check if mediaSession is supported
    if ("mediaSession" in navigator) {
      navigator.mediaSession.setActionHandler("play", () =>
        player.setIsPlaying(true),
      );
      navigator.mediaSession.setActionHandler("pause", () =>
        player.setIsPlaying(false),
      );
    }
  }, [player.setIsPlaying]);

  const handleVolumeChange = (value: number) => {
    setVolume(value);
    if (audioRef.current) audioRef.current.volume = value;
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (audioRef.current.volume !== 0) {
      handleVolumeChange(0);
      setPreviousVolume(volume);
    } else {
      handleVolumeChange(previousVolume);
    }
  };

  if (!activeSong) return null;

  return (
    <div className="bg-background text-background fixed inset-x-0 bottom-0 h-[70px] px-4 py-3">
      <audio
        ref={audioRef}
        preload="auto"
        onCanPlay={(e) => (e.currentTarget.volume = volume)}
        onEnded={() => player.setIsPlaying(false)}
      >
        <source key={activeSong.id} type="audio/mpeg" src={activeSong.url} />
        Audio not supported
      </audio>

      <div className="flex items-center justify-between gap-8">
        <div className="flex w-1/6 flex-row gap-4">
          <ImageWithFallback
            src={activeSong.artworkUrl ?? activeSong.album?.artworkUrl}
            alt={"artwork"}
            width={40}
            height={40}
            className="aspect-square rounded-sm object-cover"
          />
          <div className="flex w-full flex-col">
            <TitleScroller title={activeSong.title} />
            <div className="text-foreground text-xs font-light">
              {activeSong.artist}
            </div>
          </div>
        </div>
        <PlayerControls audioRef={audioRef} />
        <AudioProgressBar audioRef={audioRef} duration={activeSong.duration} />
        <div className="flex items-center justify-self-end">
          <Button
            variant="player"
            size="smallIcon"
            onClick={toggleMute}
            aria-label={volume === 0 ? "unmute" : "mute"}
          >
            {volume === 0 ? (
              <HiVolumeOff size={16} />
            ) : (
              <HiVolumeUp size={16} />
            )}
          </Button>
          <VolumeInput volume={volume} onVolumeChange={handleVolumeChange} />
        </div>
        <Button
          className="p-0"
          variant="player"
          aria-label="close player"
          onClick={() => player.setActiveSong(undefined)}
        >
          <HiXMark size={16} />
        </Button>
      </div>
    </div>
  );
}
