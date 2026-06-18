/**
 * Calculates the circumference of a circle.
 *
 * @param radius The radius of the circle.
 * @returns The circumference of the circle.
 */
export function calculateCircumference(radius: number): number {
  return 2 * Math.PI * radius;
}

/**
 * Calculates the stroke offset for an SVG progress circle.
 *
 * @param progressPercent The progress percentage (0 to 100).
 * @param circumference The circumference of the circle.
 * @returns The calculated stroke offset.
 */
export function calculateStrokeOffset(
  progressPercent: number,
  circumference: number
): number {
  return circumference - (progressPercent / 100) * circumference;
}
