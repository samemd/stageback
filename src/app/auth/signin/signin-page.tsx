"use client";

import { Button } from "~/components/ui/button";
import { signIn, type SignInOptions } from "next-auth/react";
import { IoLogoGoogle } from "react-icons/io";
import { BiLogoSpotify } from "react-icons/bi";
import { Separator } from "~/components/ui/separator";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useSearchParams } from "next/navigation";
import { cn } from "~/lib/utils";
import { AuthError } from "~/lib/error-map";
import { useState } from "react";

export default function SigninPage() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");

  const callbackUrl = searchParams.get("callbackUrl");
  const error = searchParams.get("error");

  // Default redirect
  let redirect = "/teams";

  const params = new URLSearchParams();
  if (callbackUrl) {
    params.set("callbackUrl", callbackUrl);
    const callbackParams = new URLSearchParams(callbackUrl.split("?")[1]);
    const token = callbackParams.get("token");
    if (token) {
      params.set("token", token);
      redirect = "/invitation";
    }
  }

  const options: SignInOptions = {
    redirect: true,
    redirectTo: `${redirect}?${params.toString()}`,
  };

  return (
    <>
      <h1
        className={cn("text-accent-foreground mt-4 mb-12 text-4xl font-bold", {
          "mb-6": !!error,
        })}
      >
        StageBack
      </h1>
      {error && (
        <div className="bg-primary/10 text-primary mb-6 w-full rounded-md p-2 text-sm">
          {AuthError[error as keyof typeof AuthError] ?? error}
        </div>
      )}
      <div className="flex h-full w-full flex-col items-center gap-8">
        <Button
          className="w-full py-6"
          variant="secondary"
          onClick={() => signIn("google", options)}
        >
          <div className="flex w-full items-center">
            <IoLogoGoogle className="mr-2 h-6 w-6 text-left" />
            <span className="flex-grow">Continue with Google</span>
          </div>
        </Button>
        <Button
          className="w-full py-6"
          variant="secondary"
          onClick={() => signIn("spotify", options)}
        >
          <div className="flex w-full items-center">
            <BiLogoSpotify className="mr-2 h-6 w-6 text-left" />
            <span className="flex-grow">Continue with Spotify</span>
          </div>
        </Button>
        <div className="flex items-center gap-4">
          <Separator className="w-32" />
          <span>or</span>
          <Separator className="w-32" />
        </div>
        <div className="w-full">
          <div className="space-y-8">
            <Label>
              Email address
              <Input
                className="mt-2 h-12"
                type="email"
                id="email"
                name="email"
                placeholder="email@example.com"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Label>
            <Button
              onClick={() => signIn("email", { ...options, email: email })}
              className="mt-4 w-full py-6"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
