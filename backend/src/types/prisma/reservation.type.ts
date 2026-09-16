import { Prisma } from "../../generated/prisma/client";

export type ReservationWithUser = Prisma.reservationsGetPayload<{
  include: {
    users: true;
  };
}>;

export type ReservationWithRoom = Prisma.reservationsGetPayload<{
  include: {
    rooms: true;
  };
}>;

export type ReservationWithPayment = Prisma.reservationsGetPayload<{
  include: {
    payments: true;
  };
}>;


export type ReservationComplete =
  Prisma.reservationsGetPayload<{
    include: {
      users: true;

      rooms: {
        include: {
          properties: {
            include: {
              users: {
                include: {
                  tenant_profiles: true;
                };
              };
            };
          };
        };
      };

      payments: true;

      reviews: true;
    };
  }>;