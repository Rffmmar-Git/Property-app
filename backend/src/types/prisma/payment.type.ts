import { Prisma } from "../../generated/prisma/client";

export type PaymentWithReservation = Prisma.paymentsGetPayload<{
  include: {
    reservations: true;
  };
}>;

export type PaymentComplete = Prisma.paymentsGetPayload<{
  include: {
    reservations: {
      include: {
        users: true;
        rooms: {
          include: {
            properties: true;
          };
        };
      };
    };
  };
}>;