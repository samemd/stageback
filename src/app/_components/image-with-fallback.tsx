"use client";

import React, {
  type ReactNode,
  type SyntheticEvent,
  useEffect,
  useState,
} from "react";
import ArtWorkPlaceholder from "public/images/artwork-placeholder.png";
import Image, { type ImageProps, type StaticImageData } from "next/image";
import { HiTrash } from "react-icons/hi2";
import { Button } from "~/components/ui/button";

type ImageWithFallbackProps = Omit<ImageProps, "src"> & {
  fallback?: string | StaticImageData;
  src: string | undefined | null;
  onDelete?: () => void;
  actionButton?: ReactNode;
};

export default function ImageWithFallback({
  fallback = ArtWorkPlaceholder,
  src,
  alt,
  actionButton,
  onDelete,
  ...props
}: ImageWithFallbackProps) {
  const [error, setError] = useState<SyntheticEvent<
    HTMLImageElement,
    Event
  > | null>(null);

  useEffect(() => {
    setError(null);
  }, [src]);

  return (
    <div className="group relative inline-block">
      <Image
        alt={alt}
        onError={setError}
        src={!error && src ? src : fallback}
        {...props}
      />
      <div className="absolute top-2 right-2 z-10 hidden items-center justify-center gap-1 group-hover:flex">
        {actionButton}
        {!error && src && onDelete && (
          <Button variant="secondary" size="sm" onClick={onDelete}>
            <HiTrash />
          </Button>
        )}
      </div>
    </div>
  );
}
