import prisma from "../config/prisma";

export class DestinationRepository {
  async findAllDestinations() {
    return prisma.destinations.findMany({
      orderBy: {
        city: "asc",
      },

      select: {
        id: true,
        city: true,
        province: true,
      },
    });
  }
}

export const destinationRepository =
  new DestinationRepository();