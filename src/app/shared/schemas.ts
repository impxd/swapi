import { z } from 'zod'

export const StarshipLength = z
  .string()
  .trim()
  .nonempty()
  .transform((str) => str.replace(/,/g, ''))
  .pipe(z.coerce.number().nonnegative())

export const StarshipHyperdriveRating = StarshipLength

export const StarshipCrew = z
  .string()
  .trim()
  .nonempty()
  .transform((str) => str.replace(/,/g, ''))
  .pipe(
    z.union([
      z.coerce.number().nonnegative(),
      z
        .string()
        .nonempty()
        .regex(/^\d+-\d+$/, 'Not a valid range of numbers'),
    ])
  )

export const StarshipPassengers = z
  .string()
  .trim()
  .nonempty()
  .transform((str) => str.replace(/,/g, ''))
  .pipe(
    z.union([
      z.coerce.number().nonnegative(),
      z.literal('unknown'),
      z.literal('n/a'),
    ])
  )

export const Starship = z.object({
  name: z.string().trim().min(5).max(40),
  model: z.string().trim().min(5).max(40),
  manufacturer: z.string().trim().min(5).max(100),
  length: StarshipLength,
  starship_class: z.string().trim().min(5).max(40),
  hyperdrive_rating: StarshipHyperdriveRating,
  crew: StarshipCrew,
  passengers: StarshipPassengers,
})
