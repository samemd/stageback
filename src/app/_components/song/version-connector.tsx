"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import useVersionConnector from "~/app/_hooks/use-version-connector";
import { toast } from "sonner";

export default function VersionConnector() {
  const { isOpen, setIsOpen, song } = useVersionConnector();
  const { data: mainVersions } = api.song.getMainVersions.useQuery();

  const utils = api.useUtils();
  const { mutate: connect } = api.song.connectVersion.useMutation({
    onSuccess: () => {
      void utils.song.getMainVersions.invalidate();
      setIsOpen(false);
      toast.success("Version connected!");
    },
  });

  const [versionOfId, setVersionOfId] = useState<string | null>(
    song?.versionOfId ?? null,
  );

  if (!mainVersions || !song) return null;
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="hidden">Open</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Connect version</DialogTitle>
          <DialogDescription>
            Make &quot;{song.title}&quot; a version of another song.
          </DialogDescription>
        </DialogHeader>
        <Select onValueChange={(id) => setVersionOfId(id)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select main version" />
          </SelectTrigger>
          <SelectContent>
            {mainVersions
              .filter((s) => s.id !== song.id)
              .map((song) => (
                <SelectItem key={song.id} value={song.id.toString()}>
                  {song.title}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        <DialogFooter>
          <Button
            type="submit"
            disabled={!versionOfId}
            onClick={() => connect({ id: song.id, versionOfId: versionOfId! })}
          >
            Connect
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
