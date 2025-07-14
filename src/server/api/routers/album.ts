import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { AlbumCreateInputSchema } from "../../../../prisma/generated/zod";
import { TRPCError } from "@trpc/server";

export const albumRouter = createTRPCRouter({
  create: protectedProcedure
    .input(AlbumCreateInputSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.album.create({
        data: input,
      });
    }),

  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.album.findMany({
      where: { songs: { some: { teamId: ctx.session.user.activeTeamId } } },
      orderBy: [{ year: "desc" }, { name: "asc" }],
    });
  }),

  getById: protectedProcedure.input(z.string()).query(({ ctx, input: id }) => {
    return ctx.db.album.findUnique({
      where: { id },
    });
  }),

  addArtwork: protectedProcedure
    .input(z.object({ albumId: z.string(), artworkUrl: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      if (!input.artworkUrl) throw new TRPCError({ code: "BAD_REQUEST" });

      return ctx.db.album.update({
        where: { id: input.albumId },
        data: { artworkUrl: input.artworkUrl },
      });
    }),

  removeArtwork: protectedProcedure
    .input(z.object({ albumId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.song.update({
        where: { id: input.albumId },
        data: { artworkUrl: null },
      });
    }),
});
