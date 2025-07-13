import { type Prisma } from "@prisma/client/edge";

export type SongWithRelations = Prisma.SongGetPayload<{
  include: { album: true };
}>;
