export interface PointSize {
  width: number;
  height: number;
  maxWidth?: number;
}

/**
 * Calculates the x,y coordinates of a point moving in a circular/elliptical path
 * Always calculates based on maxWidth for consistency across states
 *
 * @param containerWidth - Width of the container
 * @param containerHeight - Height of the container
 * @param angle - Current angle in radians
 * @param radiusPercent - Percentage of maximum radius to use (0-100)
 * @param pointWidth - Visual width of the point or element
 * @param pointHeight - Height of the point or element
 * @param maxWidth - Maximum width of the element when expanded
 * @returns Coordinates {x, y} relative to container with proper centering
 */
export function calculateCircularPosition(
  containerWidth: number,
  containerHeight: number,
  angle: number,
  radiusPercent: number = 100,
  pointWidth: number = 10,
  pointHeight: number = 10,
  maxWidth?: number,
): { x: number; y: number } {
  // Always use maxWidth for boundary calculations if provided
  const effectiveWidth = maxWidth !== undefined ? maxWidth : pointWidth;

  // Center of the container
  const centerX = containerWidth / 2;
  const centerY = containerHeight / 2;

  // Calculate maximum radius with extra margin on the right side
  const marginLeft = 15;
  const marginRight = 25; // Increased right margin to prevent drifting

  // Adjust maxRadiusX to be more conservative
  const maxRadiusX = Math.max(
    0,
    containerWidth / 2 - effectiveWidth / 2 - marginRight,
  );
  const maxRadiusY = Math.max(
    0,
    containerHeight / 2 - pointHeight / 2 - marginLeft,
  );

  // Apply radius percentage
  const effectiveRadiusX = maxRadiusX * (radiusPercent / 100);
  const effectiveRadiusY = maxRadiusY * (radiusPercent / 100);

  // Calculate raw position without element size adjustment
  const rawX = centerX + effectiveRadiusX * Math.cos(angle);
  const rawY = centerY + effectiveRadiusY * Math.sin(angle);

  // Center the element at that position, accounting for its visual width
  return {
    x: rawX - pointWidth / 2,
    y: rawY - pointHeight / 2,
  };
}

/**
 * Animation helper that uses consistent boundaries for motion
 *
 * @param onUpdate - Callback function to handle position updates
 * @param containerWidth - Width of the container
 * @param containerHeight - Height of the container
 * @param getPointSize - Function that returns current point size
 * @param speed - Speed of angular movement (radians per second)
 * @param radius - Fixed radius percentage to use
 * @param initialAngle - Optional starting angle (random if not provided)
 * @returns A cleanup function to cancel the animation
 */
export function animateCircularMotion(
  onUpdate: (position: { x: number; y: number }) => void,
  containerWidth: number,
  containerHeight: number,
  getPointSize: () => PointSize,
  speed: number = 0.5,
  radius: number = 80,
  _unused1: number = 0, // Kept for backward compatibility
  _unused2: number = 0, // Kept for backward compatibility
  initialAngle?: number,
): () => void {
  let angle = initialAngle ?? Math.random() * Math.PI * 2;
  let lastTime = performance.now() / 1000;
  let animationFrameId: number;
  let isAnimating = true;

  const animate = () => {
    if (!isAnimating) return;

    const currentTime = performance.now() / 1000;
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    // Update angle based on speed and elapsed time
    angle += speed * deltaTime;
    if (angle > Math.PI * 2) {
      angle -= Math.PI * 2; // Keep angle between 0 and 2π
    }

    // Get current point size with both visual width and max width
    const currentPointSize = getPointSize();

    // Calculate position - always use maxWidth for path calculation
    const position = calculateCircularPosition(
      containerWidth,
      containerHeight,
      angle,
      radius,
      currentPointSize.width, // Current visual width
      currentPointSize.height,
      currentPointSize.maxWidth, // Maximum width for boundary calculations
    );

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
