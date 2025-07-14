"use client";

import { UploadButton } from "~/lib/uploadthing";
import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

type UploaderProps = {
  endpoint: "imageUploader" | "audioUploader";
};

export default function Uploader({ endpoint }: UploaderProps) {
  const session = useSession();
  const utils = api.useUtils();

  return (
    <UploadButton
      className="ut-button:ut ut-button:bg-primary ut-button:after:bg-primary ut-button:focus-within:ring-0 ut-button:ut-uploading:bg-primary/50 ut-upload-icon:ut-uploading:bg-primary"
      endpoint={endpoint}
      onClientUploadComplete={async (res) => {
        void utils.song.getAll.invalidate();
        void utils.song.getMainVersions.invalidate();
        if (!res?.[0] || !session.data?.user.id) return;

        toast.success("Upload Successful!", {
          description:
            "The following files have been uploaded: " +
            res.map((r) => r.name).join(", "),
        });
      }}
      onUploadError={(error: Error) => {
        console.error(error);
        toast.error("Upload Failed!", {
          description: error.message,
        });
      }}
    />
  );
}
