import { createUploadthing, type FileRouter } from "uploadthing/next";
import { db } from "~/server/db";
import { formatSongTitle, getMetadata } from "~/lib/utils";
import { Prisma } from ".prisma/client";
import InputJsonValue = Prisma.InputJsonValue;
import { auth } from "~/server/auth";
import { utapi } from "~/server/uploadthing";

function bufferToFile(
  buffer: Uint8Array,
  filename: string,
  mimeType: string,
): File {
  return new File([buffer], filename, { type: mimeType });
}

const f = createUploadthing();

const uploadAuth = async () => {
  const session = await auth();
  if (!session?.user || !session.user.activeTeamId)
    throw new Error("Unauthorized");
  return session;
};

export const fileRouter = {
  imageUploader: f({ image: { maxFileSize: "8MB" } })
    // Set permissions and file types for this FileRoute
    .middleware(async () => {
      const session = await uploadAuth();
      return { ...session };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const { key, name, ufsUrl, size } = file;
      await db.image.create({
        data: {
          key,
          name,
          url: ufsUrl,
          size,
          uploadedById: metadata?.user.id,
        },
      });
    }),

  audioUploader: f({
    audio: {
      maxFileSize: "16MB",
      maxFileCount: 10,
      contentDisposition: "attachment",
    },
  })
    .middleware(async () => {
      const session = await uploadAuth();
      return { ...session };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const { key, name, ufsUrl, size } = file;
      const md = await getMetadata(ufsUrl, size);

      const { picture, ...commonMetadata } = md.common;
      const albumArtwork = picture && picture.length > 0 ? picture[0] : null;
      let artworkUrl: string | undefined; // To store the URL of the uploaded artwork
      if (albumArtwork) {
        try {
          // Create a File object from the Uint8Array buffer
          // Give it a meaningful name using the song title
          const artworkFilename = `${
            md.common.title ?? formatSongTitle(name)
          }-artwork.${albumArtwork.format.split("/")[1]}`; // e.g., 'image/png' -> 'png'

          const artworkFile = bufferToFile(
            albumArtwork.data,
            artworkFilename,
            albumArtwork.format,
          );

          // Upload the artwork using UTApi
          const response = await utapi.uploadFiles(artworkFile);

          if (response.data) {
            const { key, name, ufsUrl, size } = response.data;
            artworkUrl = ufsUrl;

            await db.image.create({
              data: {
                key,
                name,
                url: ufsUrl,
                size,
                uploadedById: metadata?.user.id,
              },
            });
          } else {
            console.warn(
              "UTApi uploadFiles did not return a valid URL:",
              response,
            );
          }
        } catch (error) {
          console.error("Failed to upload album artwork via UTApi:", error);
        }
      }

      const data = {
        key,
        fileName: name,
        title: md.common.title ?? formatSongTitle(name),
        artist: md.common.artist ?? "Unknown",
        album: md.common.album
          ? {
              connectOrCreate: {
                where: { name: md.common.album },
                create: { name: md.common.album },
              },
            }
          : undefined,
        url: ufsUrl,
        trackNo: md.common.track.no,
        trackOf: md.common.track.of,
        size: BigInt(size),
        duration: Math.floor(md.format.duration ?? 0),
        metadata: JSON.parse(JSON.stringify(commonMetadata)) as InputJsonValue,
        artworkUrl: artworkUrl,
        team: { connect: { id: metadata?.user.activeTeamId } },
        uploadedBy: { connect: { id: metadata?.user.id } },
      };
      console.log("CREATEEE");
      const s = await db.song.create({ data });
      console.log("CREATEEED", s);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof fileRouter;
