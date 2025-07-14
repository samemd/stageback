import { Slider } from "~/components/ui/slider";
import { Progress } from "~/components/ui/progress";

interface VolumeInputProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
}

export default function VolumeInput({
  volume,
  onVolumeChange,
}: VolumeInputProps) {
  return (
    <div className="group flex w-[90px]">
      <Slider
        className="hidden group-hover:flex"
        name="volume"
        min={0}
        max={1}
        step={0.05}
        value={[volume]}
        onValueChange={(value) => {
          onVolumeChange(value[0]!);
        }}
      />
      <Progress
        className="text-background m-auto flex h-1 group-hover:hidden"
        max={1}
        value={100 * volume}
      />
    </div>
  );
}
