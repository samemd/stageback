import Link from "next/link";
import { cn } from "~/lib/utils";
import { type PropsWithChildren } from "react";

type SidebarItemProps = PropsWithChildren & {
  href: string;
  label: string;
  className?: string;
};

export default function SidebarItem({
  href,
  label,
  children,
  className,
}: SidebarItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "hover:bg-accent hover:text-accent-foreground flex w-full flex-grow gap-2 rounded-md bg-transparent p-2.5",
        className,
      )}
    >
      {children}
      {label}
    </Link>
  );
}
