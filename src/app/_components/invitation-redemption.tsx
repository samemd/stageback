"use client";

import { Button } from "~/components/ui/button";
import { useRouter } from "next/navigation";
import { api, type RouterOutputs } from "~/trpc/react";
import { useSession } from "next-auth/react";
import { ImSpinner2 } from "react-icons/im";
import * as React from "react";

export default function InvitationRedemption({
  invitation,
}: {
  invitation: NonNullable<RouterOutputs["invitation"]["getById"]>;
}) {
  const router = useRouter();
  const { update } = useSession();

  const { mutate: redeemInvitation, isIdle } =
    api.invitation.redeem.useMutation({
      onSuccess: () => {
        void update().then(() => void router.push("/"));
      },
    });

  return (
    <>
      <p>
        <span className="font-bold">
          {invitation.invitedBy.name ?? invitation.invitedBy.email}
        </span>{" "}
        has invited you to join his team
      </p>
      <Button
        className="w-full py-6"
        onClick={() => redeemInvitation(invitation.id)}
      >
        {isIdle ? (
          <div>Join {invitation.team.name}</div>
        ) : (
          <ImSpinner2 className="h-10 w-10 animate-spin p-1" />
        )}
      </Button>
    </>
  );
}
