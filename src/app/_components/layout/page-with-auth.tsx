import { type HTMLAttributes, Suspense } from "react";
import { cn } from "~/lib/utils";
import { ThemeSwitcher } from "~/components/layout/theme-switcher";
import Navigation from "~/components/layout/navigation";
import ProfileDropdown from "~/components/layout/profile-dropdown";

export default function PageWithAuth({
  children,
  className,
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "bg-card flex w-full flex-col items-center overflow-auto rounded-md p-10 pt-4",
        className,
      )}
    >
      <div className="mb-4 flex w-full justify-between">
        <Suspense>
          <Navigation />
          <div className="flex gap-4">
            <ProfileDropdown />
            <ThemeSwitcher />
          </div>
        </Suspense>
      </div>
      {children}
    </div>
  );
}
