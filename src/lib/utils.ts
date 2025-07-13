import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";
import { type Readable } from "node:stream";
import { parseStream } from "music-metadata";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatSongTitle(title: string) {
  return title.slice(0, title.lastIndexOf("."));
}

export async function getMetadata(url: string, size: number) {
  const response = await axios<Readable>({
    method: "get",
    url: url,
    responseType: "stream",
  });

  return await parseStream(
    response.data,
    {
      mimeType: "audio/mpeg",
      size,
    },
    { duration: true },
  );
}

export function formatDuration(duration: number) {
  const min = Math.floor(duration / 60);
  const sec = Math.floor(duration - min * 60);
  return `${min}:${sec < 10 ? "0" + sec : sec}`;
}

export function formatYear(date: Date) {
  return date.getFullYear();
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function debounce<T extends (...args: any[]) => unknown>(
  cb: T,
  wait: number,
) {
  let h: NodeJS.Timeout;
  const callable = (...args: any[]) => {
    clearTimeout(h);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    h = setTimeout(() => cb(...args), wait);
  };
  return callable as any as T;
}
/* eslint-enable @typescript-eslint/no-explicit-any */
