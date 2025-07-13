import { api } from "~/trpc/server";
import InvitationRedemption from "~/components/invitation-redemption";
import InvitationFailure from "~/components/invitation-failure";

export default async function Page(props: {
  searchParams: Promise<{ token?: string }>;
}) {
  const searchParams = await props.searchParams;
  const { token } = searchParams;

  if (!token) {
    return <InvitationFailure reason="No token provided" />;
  }
  const invitation = await api.invitation.getById(token);
  if (!invitation) {
    return <InvitationFailure reason="Invitation not found" />;
  }

  if (invitation.redeemedById) {
    return <InvitationFailure reason="Invitation already redeemed" />;
  }

  return <InvitationRedemption invitation={invitation} />;
}
