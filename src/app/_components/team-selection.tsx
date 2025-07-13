"use client";

import { ImSpinner2 } from "react-icons/im";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { api, type RouterOutputs } from "~/trpc/react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function TeamSelection({
  initialTeams,
}: {
  initialTeams: RouterOutputs["team"]["getAllForUser"];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { update } = useSession();

  const callbackUrl = searchParams.get("callbackUrl");
  const utils = api.useUtils();

  const { data: teams } = api.team.getAllForUser.useQuery(undefined, {
    initialData: initialTeams,
  });
  const { mutate: updateActiveTeam, isIdle } =
    api.user.updateActiveTeam.useMutation({
      onSuccess: () => {
        void update().then(() => {
          void utils.song.invalidate();
          void utils.album.invalidate();
          void router.push(callbackUrl ?? "/");
        });
      },
    });

  return (
    <>
      <h1 className="text-accent-foreground text-3xl font-bold">
        Select your team
      </h1>
      {!isIdle ? (
        <div className="flex justify-center">
          <ImSpinner2 className="h-12 w-12 animate-spin p-1" />
        </div>
      ) : (
        <Select
          onValueChange={(id) => {
            updateActiveTeam(id);
          }}
        >
          <SelectTrigger className="text-md border-accent h-12 w-full">
            <SelectValue placeholder="Teams" />
          </SelectTrigger>
          <SelectContent>
            {teams.map((team) => (
              <SelectItem key={team.id} value={team.id}>
                {team.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </>
  );
}
