import Uploader from "~/components/upload/uploader";
import { api } from "~/trpc/server";

export default async function Home() {
  const team = await api.team.getActive();

  return (
    <div className="flex h-full flex-col items-center justify-center gap-10">
      <h1 className="text-5xl font-extrabold">
        Welcome <span>{team?.name}</span>
      </h1>
      <div className="flex items-center justify-center gap-4">
        <Uploader endpoint={"audioUploader"} />
        <Uploader endpoint={"imageUploader"} />
      </div>
    </div>
  );
}
