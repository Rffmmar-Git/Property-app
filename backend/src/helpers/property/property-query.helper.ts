import { Request } from "express";
import {
  PropertyQueryDto,
  PropertySortBy,
  PropertySortOrder,
} from "../../types/dto/property";

export function parsePropertyQuery(
  req: Request
): PropertyQueryDto {
  return {
    page: req.query.page
      ? Number(req.query.page)
      : undefined,

    pageSize: req.query.pageSize
      ? Number(req.query.pageSize)
      : undefined,

    search: req.query.search as string | undefined,

    city: req.query.city as string | undefined,

    category: req.query.category as string | undefined,

    checkIn: req.query.checkIn as string | undefined,

    duration: req.query.duration
      ? Number(req.query.duration)
      : undefined,

    sortBy:
      req.query.sortBy as PropertySortBy | undefined,

    order:
      req.query.order as PropertySortOrder | undefined,
  };
}