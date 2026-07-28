import { Prisma } from "../../generated/prisma/client";
export type RoomWithProperty = Prisma.roomsGetPayload<{
  include: {
    properties: true;
  };
}>;

export type RoomWithAvailabilities = Prisma.roomsGetPayload<{
  include: {
    room_availabilities: true;
  };
}>;

export type RoomWithPeakSeasonRates = Prisma.roomsGetPayload<{
  include: {
    peak_season_rates: true;
  };
}>;

export type RoomComplete = Prisma.roomsGetPayload<{
  include: {
    properties: true;
    room_availabilities: true;
    peak_season_rates: true;
  };
}>;