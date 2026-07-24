import { Prisma } from "../../generated/prisma/client";

export type ReviewWithUser = Prisma.reviewsGetPayload<{
  include: {
    users: true;
  };
}>;

export type ReviewWithReservation = Prisma.reviewsGetPayload<{
  include: {
    reservations: true;
  };
}>;

export type ReviewComplete = Prisma.reviewsGetPayload<{
  include: {
    users: true;
    properties: true;
    reservations: {
      include: {
        rooms: true;
      };
    };
  };
}>;