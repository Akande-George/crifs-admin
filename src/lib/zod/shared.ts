import { z } from "zod";

/* ─── Shared Primitives ─── */

export const NairaAmountSchema = z.number().nonnegative();
export const RCNumberSchema = z.string().regex(/^\d{6,7}$/, "RC number must be 6–7 digits");
export const PhoneNumberSchema = z.string().regex(/^\+234\d{10}$/, "Must be +234 format");
export const PercentSchema = z.number().min(0).max(100);

export const PaginationSchema = z.object({
  page: z.number().int().positive().default(1),
  perPage: z.number().int().positive().max(100).default(20),
  total: z.number().int().nonnegative(),
  totalPages: z.number().int().nonnegative(),
});

export const SortOrderSchema = z.enum(["asc", "desc"]).default("desc");

export const DateRangeSchema = z.object({
  from: z.string().datetime(),
  to: z.string().datetime(),
});

/* ─── Inferred Shared Types ─── */
export type NairaAmount = z.infer<typeof NairaAmountSchema>;
export type Pagination = z.infer<typeof PaginationSchema>;
export type SortOrder = z.infer<typeof SortOrderSchema>;
export type DateRange = z.infer<typeof DateRangeSchema>;
