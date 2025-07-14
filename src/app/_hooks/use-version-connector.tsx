import { create } from "zustand";
import { type Song } from ".prisma/client";

interface VersionConnectorStore {
  isOpen: boolean;
  song: Song | null;
  setIsOpen: (value: boolean) => void;
  setSong: (song: Song) => void;
}

const useVersionConnector = create<VersionConnectorStore>((set) => ({
  isOpen: false,
  song: null,
  setIsOpen: (value) => set({ isOpen: value }),
  setSong: (song) => set({ song }),
}));

export default useVersionConnector;
