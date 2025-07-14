import { toast } from "sonner";
import { useUploadThing } from "~/lib/utils";
import React, { type ReactNode, useCallback, useRef } from "react";
import { useDropzone } from "@uploadthing/react";
import {
  generateClientDropzoneAccept,
  generatePermittedFileTypes,
} from "@uploadthing/shared";
import { Label } from "~/components/ui/label";
import { buttonVariants } from "~/components/ui/button";

interface ImageUploadProps {
  children?: ReactNode;
  onClientUploadComplete: (
    url: string,
    toastId: string | number | undefined,
  ) => void;
}

export function ImageUploader({
  onClientUploadComplete,
  children,
}: ImageUploadProps) {
  const toastIdRef = useRef<string | number>(undefined);

  const { startUpload, routeConfig } = useUploadThing("imageUploader", {
    onClientUploadComplete: (data) => {
      if (!data[0]?.ufsUrl) return;
      onClientUploadComplete(data[0].ufsUrl, toastIdRef.current);
    },
    onUploadError: () => {
      toast.error("error occurred while uploading your Artwork", {
        id: toastIdRef.current,
      });
    },
    onUploadBegin: () => {
      toastIdRef.current = toast.loading("Upload started...");
    },
  });

  const onDrop = useCallback(
    (accepted: File[]) => {
      void startUpload(accepted);
    },
    [startUpload],
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(
      generatePermittedFileTypes(routeConfig).fileTypes,
    ),
    multiple: false,
  });

  return (
    <div {...getRootProps()}>
      <Label className={buttonVariants({ variant: "secondary", size: "sm" })}>
        {children}
        <input {...getInputProps()} />
      </Label>
    </div>
  );
}
