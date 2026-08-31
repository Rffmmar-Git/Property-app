import { Router } from "express";

import { propertyCategoryController } from "../controllers/property-category.controller";

import { authenticate } from "../middlewares/auth.middleware";

import { authorize } from "../middlewares/role.middleware";

import { user_role } from "../generated/prisma/enums";

const router = Router();

/**
 * Get all property categories
 * GET /api/properties/categories
 *
 * Public endpoint.
 */
router.get(
  "/",
  propertyCategoryController.getAll,
);

/**
 * Get property category by ID
 * GET /api/properties/categories/:id
 *
 * Public endpoint.
 */
router.get(
  "/:id",
  propertyCategoryController.getById,
);

/**
 * Create property category
 * POST /api/properties/categories
 *
 * Tenant only.
 */
router.post(
  "/",
  authenticate,
  authorize(user_role.TENANT),
  propertyCategoryController.create,
);

/**
 * Update property category
 * PATCH /api/properties/categories/:id
 *
 * Tenant only.
 */
router.patch(
  "/:id",
  authenticate,
  authorize(user_role.TENANT),
  propertyCategoryController.update,
);

/**
 * Delete property category
 * DELETE /api/properties/categories/:id
 *
 * Tenant only.
 */
router.delete(
  "/:id",
  authenticate,
  authorize(user_role.TENANT),
  propertyCategoryController.delete,
);

export default router;