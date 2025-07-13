import SigninPage from "~/app/auth/signin/signin-page";
import { redirect } from "next/navigation";
import { auth } from "~/server/auth";

export default async function Page() {
  const session = await auth();
  if (session) {
    redirect("/");
  }

  return (
    <div className="bg-background flex h-full w-full items-center justify-center">
      <div className="bg-card flex flex-col items-center overflow-auto rounded-md p-10 pt-4">
        <SigninPage />
      </div>
    </div>
  );
}
