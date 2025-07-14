import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { SongUncheckedCreateInputSchema } from "../../../../prisma/generated/zod";
import { TRPCError } from "@trpc/server";

export const songRouter = createTRPCRouter({
  create: protectedProcedure
    .input(SongUncheckedCreateInputSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.song.create({
        data: {
          ...input,
          uploadedById: ctx.session.user.id,
        },
      });
    }),

  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.song.findMany({
      where: { teamId: ctx.session.user.activeTeamId },
      include: { album: true },
      orderBy: { album: { year: "desc" } },
    });
  }),

  getMainVersions: protectedProcedure.query(({ ctx }) => {
    return ctx.db.song.findMany({
      where: { teamId: ctx.session.user.activeTeamId, versionOfId: null },
      include: { album: true },
      orderBy: { album: { year: "desc" } },
    });
  }),

  getMainVersionsForAlbum: protectedProcedure
    .input(z.string())
    .query(({ input: albumId, ctx }) => {
      return ctx.db.song.findMany({
        where: {
          albumId,
          teamId: ctx.session.user.activeTeamId,
          versionOfId: null,
        },
        include: { album: true },
        orderBy: { trackNo: "asc" },
      });
    }),

  getById: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input: id }) => {
      return ctx.db.song.findUnique({
        where: { id },
        include: {
          album: true,
          versionOf: true,
          versions: { include: { album: true }, orderBy: { title: "asc" } },
        },
      });
    }),

  connectVersion: protectedProcedure
    .input(z.object({ id: z.string(), versionOfId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const subVersions = await ctx.db.song.findMany({
        where: { versionOfId: input.id },
      });
      const ids = [input.id, ...subVersions.map((v) => v.id)];
      return ctx.db.song.updateMany({
        where: { id: { in: ids } },
        data: { versionOfId: input.versionOfId },
      });
    }),

  promoteToMainVersion: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const song = await ctx.db.song.findFirst({
        where: { id: input.id },
      });

      if (!song) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const currentMainVersionId = song.versionOfId;

      if (!currentMainVersionId) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      const subVersions = await ctx.db.song.findMany({
        where: { versionOfId: currentMainVersionId },
      });

      const ids = [currentMainVersionId, ...subVersions.map((v) => v.id)];

      await ctx.db.$transaction([
        ctx.db.song.updateMany({
          where: {
            id: { in: ids },
          },
          data: { versionOfId: input.id },
        }),
        ctx.db.song.update({
          where: { id: input.id },
          data: { versionOfId: null },
        }),
      ]);

      return { success: true, id: song.id };
    }),

  addArtwork: protectedProcedure
    .input(z.object({ songId: z.string(), artworkUrl: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      if (!input.artworkUrl) throw new TRPCError({ code: "BAD_REQUEST" });

      return ctx.db.song.updateMany({
        where: { OR: [{ id: input.songId }, { versionOfId: input.songId }] },
        data: { artworkUrl: input.artworkUrl },
      });
    }),

  removeArtwork: protectedProcedure
    .input(z.object({ songId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.song.updateMany({
        where: { OR: [{ id: input.songId }, { versionOfId: input.songId }] },
        data: { artworkUrl: null },
      });
    }),

  search: protectedProcedure
    .input(z.string().nullable())
    .query(({ ctx, input: query }) => {
      if (!query) return [];

      return ctx.db.song.findMany({
        where: {
          teamId: ctx.session.user.activeTeamId,
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { artist: { contains: query, mode: "insensitive" } },
            { album: { name: { contains: query, mode: "insensitive" } } },
          ],
        },
        include: { album: true },
        orderBy: { album: { year: "desc" } },
      });
    }),
});
