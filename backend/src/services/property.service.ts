import { propertyRepository } from "../repositories/property.repository";
import { mapPropertyListResponse } from "../helpers/property/property-card.mapper";
import { mapPropertyDetail } from "../helpers/property/property-detail.mapper";
import { ApiError } from "../utils/core/ApiError";
import {
  PropertyListResponseDto,
  PropertyQueryDto,
  PropertySortBy,
  PropertySortOrder,
} from "../types/dto/property";
import { Prisma } from "../generated/prisma/client";

export class PropertyService {
  async getAllProperties(
    query: PropertyQueryDto,
  ): Promise<PropertyListResponseDto> {
    const page = query.page && query.page > 0 ? query.page : 1;

    const pageSize =
      query.pageSize && query.pageSize > 0 ? Math.min(query.pageSize, 50) : 10;

    const allowedSortBy: PropertySortBy[] = ["created_at", "name", "price"];

    const sortBy = allowedSortBy.includes(query.sortBy as PropertySortBy)
      ? (query.sortBy as PropertySortBy)
      : "created_at";

    const order: PropertySortOrder =
      query.order === "asc" || query.order === "desc" ? query.order : "desc";

    const { properties, totalItems } =
      await propertyRepository.findAllProperties({
        ...query,
        page,
        pageSize,
        sortBy,
        order,
      });

    const dateRange = this.getDateRange(query);

    const requiresPostProcessing = dateRange !== null || sortBy === "price";

    let processedProperties = dateRange
      ? properties
          .map((property) => {
            const availableRooms = property.rooms
              .filter((room) =>
                this.isRoomAvailable(
                  room,
                  dateRange.checkIn,
                  dateRange.checkOut,
                ),
              )
              .map((room) => ({
                base_price: this.calculateEffectivePrice(
                  room,
                  dateRange.checkIn,
                  dateRange.checkOut,
                ),
              }));

            return {
              ...property,
              rooms: availableRooms,
            };
          })
          .filter((property) => property.rooms.length > 0)
      : properties;

    if (sortBy === "price") {
      processedProperties = [...processedProperties].sort((a, b) => {
        const priceA = this.getLowestRoomPrice(a.rooms);
        const priceB = this.getLowestRoomPrice(b.rooms);

        return order === "asc" ? priceA - priceB : priceB - priceA;
      });
    }

    const finalTotalItems = requiresPostProcessing
      ? processedProperties.length
      : totalItems;

    const paginatedProperties = requiresPostProcessing
      ? processedProperties.slice((page - 1) * pageSize, page * pageSize)
      : processedProperties;

    return mapPropertyListResponse(paginatedProperties, {
      page,
      pageSize,
      totalItems: finalTotalItems,
      totalPages: Math.ceil(finalTotalItems / pageSize),
    });
  }

  async getPropertyById(id: string, roomId?: string) {
  const property = await propertyRepository.findPropertyById(BigInt(id));

  if (!property) {
    throw new ApiError(404, "Property not found");
  }

  let priceCalendar;

  if (roomId) {
    const selectedRoom = property.rooms.find(
      (room) => room.id === BigInt(roomId),
    );

    if (!selectedRoom) {
      throw new ApiError(404, "Room not found");
    }

    priceCalendar = this.generatePriceCalendar([selectedRoom]);
  } else {
    priceCalendar = this.generatePriceCalendar(property.rooms);
  }

  return mapPropertyDetail({
    ...property,
    priceCalendar,
  });
}

  private getLowestRoomPrice(
    rooms: {
      base_price: Prisma.Decimal;
    }[],
  ): number {
    if (rooms.length === 0) {
      return Infinity;
    }

    return Math.min(...rooms.map((room) => Number(room.base_price)));
  }

  private getDateRange(query: PropertyQueryDto) {
    if (!query.checkIn || !query.duration || query.duration <= 0) {
      return null;
    }

    const checkIn = new Date(`${query.checkIn}T00:00:00.000Z`);

    if (Number.isNaN(checkIn.getTime())) {
      return null;
    }

    const checkOut = new Date(checkIn);

    checkOut.setUTCDate(checkOut.getUTCDate() + query.duration);

    return {
      checkIn,
      checkOut,
    };
  }

  private getStayDates(checkIn: Date, checkOut: Date): Date[] {
    const dates: Date[] = [];
    const current = new Date(checkIn);

    while (current < checkOut) {
      dates.push(new Date(current));

      current.setUTCDate(current.getUTCDate() + 1);
    }

    return dates;
  }

  private isRoomAvailable(
    room: {
      total_rooms: number;
      room_availabilities: {
        available_date: Date;
        available_rooms: number;
        is_closed: boolean | null;
      }[];
      reservations: {
        check_in: Date;
        check_out: Date;
        status: string | null;
      }[];
    },
    checkIn: Date,
    checkOut: Date,
  ): boolean {
    const stayDates = this.getStayDates(checkIn, checkOut);

    const activeStatuses = [
      "WAITING_PAYMENT",
      "WAITING_CONFIRMATION",
      "CONFIRMED",
    ];

    return stayDates.every((stayDate) => {
      const availability = room.room_availabilities.find((item) =>
        this.isSameDate(item.available_date, stayDate),
      );

      if (availability?.is_closed === true) {
        return false;
      }

      let availableRooms =
        availability?.available_rooms ?? room.total_rooms;

      const reservedRooms = room.reservations.filter((reservation) => {
        if (
          !reservation.status ||
          !activeStatuses.includes(reservation.status)
        ) {
          return false;
        }

        return (
          reservation.check_in < this.addDays(stayDate, 1) &&
          reservation.check_out > stayDate
        );
      }).length;

      availableRooms -= reservedRooms;

      return availableRooms > 0;
    });
  }

  private calculateEffectivePrice(
    room: {
      base_price: Prisma.Decimal;
      peak_season_rates: {
        start_date: Date;
        end_date: Date;
        adjustment_type: string;
        adjustment_value: Prisma.Decimal;
      }[];
    },
    checkIn: Date,
    checkOut: Date,
  ): Prisma.Decimal {
    const stayDates = this.getStayDates(checkIn, checkOut);

    const nightlyPrices = stayDates.map((stayDate) => {
      const applicableRates = room.peak_season_rates.filter(
        (rate) =>
          rate.start_date <= stayDate &&
          rate.end_date >= stayDate,
      );

      let price = Number(room.base_price);

      if (applicableRates.length > 0) {
        const rate = applicableRates[0];
        const adjustmentValue = Number(rate.adjustment_value);

        if (rate.adjustment_type === "PERCENTAGE") {
          price += price * (adjustmentValue / 100);
        } else if (rate.adjustment_type === "FIXED") {
          price += adjustmentValue;
        }
      }

      return price;
    });

    if (!nightlyPrices.length) {
      return room.base_price;
    }

    return new Prisma.Decimal(Math.min(...nightlyPrices));
  }

  private generatePriceCalendar(
    rooms: {
      id: bigint;
      base_price: Prisma.Decimal;
      total_rooms: number;
      room_availabilities: {
        available_date: Date;
        available_rooms: number;
        is_closed: boolean | null;
      }[];
      reservations: {
        check_in: Date;
        check_out: Date;
        status: string | null;
      }[];
      peak_season_rates: {
        start_date: Date;
        end_date: Date;
        adjustment_type: string;
        adjustment_value: Prisma.Decimal;
      }[];
    }[],
  ) {
    const calendar: {
      date: string;
      price: number | null;
      available: boolean;
    }[] = [];

    const startDate = new Date();
    startDate.setUTCHours(0, 0, 0, 0);

    for (let i = 0; i < 30; i++) {
      const currentDate = new Date(startDate);

      currentDate.setUTCDate(currentDate.getUTCDate() + i);

      const nextDate = this.addDays(currentDate, 1);

      const availableRooms = rooms.filter((room) =>
        this.isRoomAvailable(room, currentDate, nextDate),
      );

      if (availableRooms.length === 0) {
        calendar.push({
          date: currentDate.toISOString().split("T")[0],
          price: null,
          available: false,
        });

        continue;
      }

      const prices = availableRooms.map((room) =>
        Number(
          this.calculateEffectivePrice(
            room,
            currentDate,
            nextDate,
          ),
        ),
      );

      calendar.push({
        date: currentDate.toISOString().split("T")[0],
        price: Math.min(...prices),
        available: true,
      });
    }

    return calendar;
  }

  private isSameDate(firstDate: Date, secondDate: Date): boolean {
    return (
      firstDate.getUTCFullYear() === secondDate.getUTCFullYear() &&
      firstDate.getUTCMonth() === secondDate.getUTCMonth() &&
      firstDate.getUTCDate() === secondDate.getUTCDate()
    );
  }

  private addDays(date: Date, days: number): Date {
    const result = new Date(date);

    result.setUTCDate(result.getUTCDate() + days);

    return result;
  }
}

export const propertyService = new PropertyService();