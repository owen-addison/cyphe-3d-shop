export interface PointSize {
  width: number;
  height: number;
  offsetX?: number; // Make it optional with ?
  isExpanded: boolean;
}

/**
 * Calculates the x,y coordinates of a point moving in a circular/elliptical path
 *
 * @param containerWidth - Width of the container (w)
 * @param containerHeight - Height of the container (h)
 * @param angle - Current angle in radians (α)
 * @param radiusPercent - Percentage of maximum radius to use (0-100)
 * @param pointSizeX - Width of the point or element
 * @param pointSizeY - Height of the point or element
 * @returns Coordinates {x, y} relative to the center of the container
 */
export function calculateCircularPosition(
  containerWidth: number,
  containerHeight: number,
  angle: number,
  radiusPercent: number = 100,
  width: number = 10,
  height: number = 10,
  offsetX: number = width / 2, // Default to center if not specified
): { x: number; y: number } {
  // Calculate the center of the container
  const centerX = containerWidth / 2;
  const centerY = containerHeight / 2;

  // Calculate maximum possible radius in each direction
  const margin = 10; // Safety margin

  // Use the full width for horizontal constraint calculation
  const maxRadiusX = Math.max(0, containerWidth / 2 - offsetX - margin);
  // Use the full height for vertical constraint calculation
  const maxRadiusY = Math.max(0, containerHeight / 2 - height / 2 - margin);

  // Apply radius percentage (allows for oscillation)
  const effectiveRadiusX = maxRadiusX * (radiusPercent / 100);
  const effectiveRadiusY = maxRadiusY * (radiusPercent / 100);

  // Calculate position using parametric equation of ellipse
  const x = centerX + effectiveRadiusX * Math.cos(angle);
  const y = centerY + effectiveRadiusY * Math.sin(angle);

  return { x, y };
}

/**
 * Oscillates a value between min and max with a sine wave
 *
 * @param min - Minimum value
 * @param max - Maximum value
 * @param time - Current time parameter (increases continuously)
 * @param period - Period of oscillation
 * @returns A value oscillating between min and max
 */
export function oscillate(
  min: number,
  max: number,
  time: number,
  period: number = 5,
): number {
  const amplitude = (max - min) / 2;
  const offset = min + amplitude;
  return offset + amplitude * Math.sin((time * 2 * Math.PI) / period);
}

/**
 * Calculates what proportion of a transition between sizes has completed
 *
 * @param current - Current transition frame
 * @param total - Total transition frames
 * @returns A value between 0 (start) and 1 (end) with easing
 */
function easeTransition(current: number, total: number): number {
  // Ensure we stay within 0-1 range
  const t = Math.min(1, Math.max(0, current / total));

  // Cubic easing function: smoother acceleration and deceleration
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Animation helper that updates position over time with adaptive sizing
 *
 * @param onUpdate - Callback function to handle position updates
 * @param containerWidth - Width of the container
 * @param containerHeight - Height of the container
 * @param getPointSize - Function that returns current point size (allows dynamic changes)
 * @param speed - Speed of angular movement (radians per second)
 * @param minRadius - Minimum radius percentage (0-100)
 * @param maxRadius - Maximum radius percentage (0-100)
 * @param radiusOscillationPeriod - How long it takes to complete a radius oscillation cycle
 * @param initialAngle - Optional starting angle (random if not provided)
 * @returns A cleanup function to cancel the animation
 */
export function animateCircularMotion(
  onUpdate: (position: { x: number; y: number }) => void,
  containerWidth: number,
  containerHeight: number,
  getPointSize: () => PointSize,
  speed: number = 0.5,
  minRadius: number = 60,
  maxRadius: number = 90,
  radiusOscillationPeriod: number = 8,
  initialAngle?: number,
): () => void {
  let angle = initialAngle ?? Math.random() * Math.PI * 2;
  let lastTime = performance.now() / 1000;
  let elapsedTime = 0;
  let animationFrameId: number;
  let isAnimating = true;

  // Store the last position to transition from
  let lastPosition = {
    x: containerWidth / 2,
    y: containerHeight / 2,
  };

  const animate = () => {
    if (!isAnimating) return;

    const currentTime = performance.now() / 1000;
    const deltaTime = currentTime - lastTime;

    // Update tracking variables
    lastTime = currentTime;
    elapsedTime += deltaTime;

    // Update angle based on speed and elapsed time
    angle += speed * deltaTime;
    if (angle > Math.PI * 2) {
      angle -= Math.PI * 2; // Keep angle between 0 and 2π
    }

    // Calculate oscillating radius
    const radius = oscillate(
      minRadius,
      maxRadius,
      elapsedTime,
      radiusOscillationPeriod,
    );

    // Get current point size - still using the func but dimensions are now consistent
    const currentPointSize = getPointSize();

    // Calculate position using consistent boundaries
    const position = calculateCircularPosition(
      containerWidth,
      containerHeight,
      angle,
      radius,
      currentPointSize.width,
      currentPointSize.height,
      currentPointSize.offsetX,
    );

    // Store last position
    lastPosition = position;

    // Call the update callback with the new position
    onUpdate(position);

    // Continue animation loop
    animationFrameId = requestAnimationFrame(animate);
  };

  // Start animation
  animationFrameId = requestAnimationFrame(animate);

  // Return cleanup function
  return () => {
    isAnimating = false;
    cancelAnimationFrame(animationFrameId);
  };
}

/**
 * Helper function to distribute starting angles evenly around a circle
 * Useful for multiple floating points to prevent bunching
 *
 * @param count - Number of points
 * @param randomFactor - How much randomness to add (0-1)
 * @returns Array of angles in radians
 */
export function distributeAngles(
  count: number,
  randomFactor: number = 0.2,
): number[] {
  const angles: number[] = [];
  const angleStep = (Math.PI * 2) / count;

  for (let i = 0; i < count; i++) {
    // Add some random variation to the angle, but keep it within bounds
    const variation =
      (Math.random() * randomFactor * 2 - randomFactor) * angleStep;
    angles.push((i * angleStep + variation) % (Math.PI * 2));
  }

  return angles;
}
