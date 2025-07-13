import { Suspense } from "react";
import Search from "~/components/search";

export default function SearchPage() {
  return (
    <Suspense>
      <Search />
    </Suspense>
  );
}
