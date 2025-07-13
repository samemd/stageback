"use client";

import React, { createContext, useRef, useState } from "react";

type Ids = { active: string[]; temp: string[] };

type AudioCtxType = {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  id?: string;
  ids: Ids;
  setId: React.Dispatch<React.SetStateAction<string | undefined>>;
  setIds: React.Dispatch<React.SetStateAction<Ids>>;
  updateIds: () => void;
  reset: () => void;
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  togglePlay: () => void;
};

export const AudioCtx = createContext<AudioCtxType>({
  audioRef: { current: null },
  id: undefined,
  ids: { active: [], temp: [] },
  setId: () => {
    throw new Error("load function must be overridden by provider");
  },
  setIds: () => {
    throw new Error("setIds function must be overridden by provider");
  },
  updateIds: () => {
    throw new Error("updateIds function must be overridden by provider");
  },
  reset: () => {
    throw new Error("reset function must be overridden by provider");
  },
  isPlaying: false,
  setIsPlaying: () => {
    throw new Error("setIsPlaying function must be overridden by provider");
  },
  togglePlay: () => {
    throw new Error("togglePlay function must be overridden by provider");
  },
});

export default function AudioProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [id, setId] = useState<string | undefined>(undefined);
  const [ids, setIds] = useState<Ids>({ active: [], temp: [] });
  const [isPlaying, setIsPlaying] = useState(false);
  const updateIds = () => setIds((state) => ({ active: state.temp, temp: [] }));
  const reset = () => {
    setId(undefined);
    setIds({ active: [], temp: [] });
  };
  const togglePlayPause = () => setIsPlaying((prevIsPlaying) => !prevIsPlaying);

  return (
    <AudioCtx.Provider
      value={{
        audioRef,
        id,
        ids,
        setId,
        setIds,
        updateIds,
        reset,
        isPlaying,
        setIsPlaying,
        togglePlay: togglePlayPause,
      }}
    >
      {children}
    </AudioCtx.Provider>
  );
}
