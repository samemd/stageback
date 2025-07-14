"use client";

import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { useRouter } from "next/navigation";

export default function Navigation() {
  const router = useRouter();
  return (
    <div className="flex gap-2">
      <HiChevronLeft
        onClick={() => router.back()}
        className="h-8 w-8 cursor-pointer rounded-full bg-background p-1.5 pr-2 text-accent-foreground hover:scale-110 hover:bg-accent"
      />
      <HiChevronRight
        onClick={() => router.forward()}
        className="h-8 w-8 cursor-pointer rounded-full bg-background p-1.5 pl-2 text-accent-foreground hover:scale-110 hover:bg-accent"
      />
    </div>
  );
}
