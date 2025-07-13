import { create } from "zustand";
import { type SongWithRelations } from "~/lib/types";

interface PlayerStore {
  activeSong?: SongWithRelations;
  ids: string[];
  tempIds: string[];
  setActiveSong: (song: SongWithRelations | undefined) => void;
  setIds: (ids: string[]) => void;
  setTempIds: (ids: string[]) => void;
  updateIds: () => void;
  reset: () => void;
  isPlaying: boolean;
  setIsPlaying: (value: boolean) => void;
  togglePlay: () => void;
  spaceBarEnabled: boolean;
  setSpaceBarEnabled: (value: boolean) => void;
}

const usePlayer = create<PlayerStore>((set) => ({
  activeSong: undefined,
  ids: [],
  tempIds: [],
  setActiveSong: (song) => set({ activeSong: song }),
  setIds: (ids) => set({ ids }),
  setTempIds: (ids) => set({ tempIds: ids }),
  updateIds: () => set((state) => ({ ids: state.tempIds, tempIds: [] })),
  reset: () => set({ ids: [], activeSong: undefined }),
  isPlaying: false,
  setIsPlaying: (value) => set({ isPlaying: value }),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  spaceBarEnabled: true,
  setSpaceBarEnabled: (value) => set({ spaceBarEnabled: value }),
}));

export default usePlayer;
