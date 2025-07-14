"use client";

import { api } from "~/trpc/react";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { HiOutlineUser } from "react-icons/hi2";
import { type Team } from "@prisma/client";

export default function ProfileDropdown() {
  const utils = api.useUtils();
  const { data, update } = useSession();
  const [otherTeams, setOtherTeams] = useState<Team[]>([]);

  const activeTeamId = data?.user.activeTeamId;
  const { data: team } = api.team.getById.useQuery(activeTeamId!, {
    enabled: !!data,
  });
  const { data: teams } = api.team.getAllForUser.useQuery();
  const { mutate: updateActiveTeam } = api.user.updateActiveTeam.useMutation({
    onSuccess: () => {
      void update().then(() => {
        void utils.song.invalidate();
        void utils.album.invalidate();
      });
    },
  });

  useEffect(() => {
    const filteredTeams = teams?.filter(
      (t) => t.id !== data?.user.activeTeamId,
    );
    setOtherTeams(filteredTeams ?? []);
  }, [teams, data?.user.activeTeamId]);

  return (
    <div className="flex items-center gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger className="rounded-full">
          <HiOutlineUser className="border-primary text-accent-foreground hover:bg-background h-9 w-9 rounded-full border p-2" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-52" align="end">
          <DropdownMenuLabel>{team?.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {!!otherTeams.length && (
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Switch team</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {otherTeams.map((team) => (
                    <DropdownMenuItem
                      key={team.id}
                      onSelect={() => {
                        void updateActiveTeam(team.id);
                      }}
                    >
                      {team.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          )}
          <DropdownMenuItem onSelect={() => signOut()}>
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
