import prisma from "../config/prisma";
import { adjustment_type } from "../generated/prisma/enums";

export class TenantPeakSeasonRepository {
  async create(data: {
    roomId: bigint;
    startDate: Date;
    endDate: Date;
    adjustmentType: adjustment_type;
    adjustmentValue: number;
  }) {
    return prisma.peak_season_rates.create({
      data: {
        room_id: data.roomId,
        start_date: data.startDate,
        end_date: data.endDate,
        adjustment_type: data.adjustmentType,
        adjustment_value: data.adjustmentValue,
      },
    });
  }

  async findManyByRoom(roomId: bigint) {
    return prisma.peak_season_rates.findMany({
      where: {
        room_id: roomId,
      },
      orderBy: {
        start_date: "asc",
      },
    });
  }

  async findById(id: bigint) {
    return prisma.peak_season_rates.findUnique({
      where: {
        id,
      },
    });
  }

  async update(
    id: bigint,
    data: {
      startDate?: Date;
      endDate?: Date;
      adjustmentType?: adjustment_type;
      adjustmentValue?: number;
    },
  ) {
    return prisma.peak_season_rates.update({
      where: {
        id,
      },
      data: {
        ...(data.startDate !== undefined && {
          start_date: data.startDate,
        }),
        ...(data.endDate !== undefined && {
          end_date: data.endDate,
        }),
        ...(data.adjustmentType !== undefined && {
          adjustment_type: data.adjustmentType,
        }),
        ...(data.adjustmentValue !== undefined && {
          adjustment_value: data.adjustmentValue,
        }),
      },
    });
  }

  async delete(id: bigint) {
    return prisma.peak_season_rates.delete({
      where: {
        id,
      },
    });
  }
}

export const tenantPeakSeasonRepository =
  new TenantPeakSeasonRepository();