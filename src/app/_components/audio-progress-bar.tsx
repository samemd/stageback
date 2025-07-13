import { Slider } from "~/components/ui/slider";
import { Progress } from "~/components/ui/progress";
import { formatDuration } from "~/lib/utils";
import * as React from "react";
import { type RefObject, useEffect, useState } from "react";

interface AudioProgressBarProps extends React.ComponentProps<typeof Slider> {
  audioRef: RefObject<HTMLAudioElement | null>;
  duration: number;
}

export default function AudioProgressBar({
  audioRef,
  duration,
  ...rest
}: AudioProgressBarProps) {
  const [currentProgress, setCurrentProgress] = useState(0);

  useEffect(() => {
    if (!audioRef.current) return;

    const handleTimeUpdate = (e: Event) => {
      const target = e.currentTarget as HTMLAudioElement;
      setCurrentProgress(target.currentTime);
    };

    const audioEl = audioRef.current;
    audioEl.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audioEl.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [audioRef]);

  return (
    <div className="flex flex-grow gap-2">
      <p className="text-foreground w-8 text-right text-xs font-light">
        {formatDuration(currentProgress)}
      </p>
      <div className="relative flex flex-grow">
        <div className="group flex flex-grow">
          <Slider
            className="hidden group-hover:flex"
            min={0}
            max={duration}
            value={[currentProgress]}
            onValueChange={(value) => {
              if (!audioRef.current) return;
              audioRef.current.currentTime = value[0]!;
              setCurrentProgress(value[0]!);
            }}
            {...rest}
          />
          <Progress
            className="text-background m-auto flex h-1 group-hover:hidden"
            max={duration}
            value={(100 / duration) * currentProgress}
          />
        </div>
      </div>
      {duration && (
        <p className="text-foreground w-8 text-xs font-light">
          {formatDuration(duration)}
        </p>
      )}
    </div>
  );
}
