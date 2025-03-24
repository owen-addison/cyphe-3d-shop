/**
 * Calculates the x,y coordinates of a point moving in a circular/elliptical path
 *
 * @param containerWidth - Width of the container (w)
 * @param containerHeight - Height of the container (h)
 * @param angle - Current angle in radians (α)
 * @param radiusPercent - Percentage of maximum radius to use (0-100)
 * @param pointSizeX - Width of the point or element (can be different in collapsed/expanded states)
 * @param pointSizeY - Height of the point or element
 * @returns Coordinates {x, y} relative to the center of the container
 */
export function calculateCircularPosition(
  containerWidth: number,
  containerHeight: number,
  angle: number,
  radiusPercent: number = 100,
  pointSizeX: number = 10,
  pointSizeY: number = 10,
): { x: number; y: number } {
  // Calculate the center of the container
  const centerX = containerWidth / 2;
  const centerY = containerHeight / 2;

  // Calculate maximum possible radius in each direction (accounting for point size)
  const margin = 5; // Additional safety margin

  const maxRadiusX = containerWidth / 2 - pointSizeX / 2 - margin;
  const maxRadiusY = containerHeight / 2 - pointSizeY / 2 - margin;

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
 * Animation helper that updates position over time
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
  getPointSize: () => { width: number; height: number },
  speed: number = 0.5,
  minRadius: number = 60,
  maxRadius: number = 90,
  radiusOscillationPeriod: number = 8,
  initialAngle?: number,
): () => void {
  let angle = initialAngle ?? Math.random() * Math.PI * 2; // Use provided or random starting angle
  let lastTime = performance.now() / 1000;
  let elapsedTime = 0;
  let animationFrameId: number;
  let isAnimating = true;

  const animate = () => {
    if (!isAnimating) return;

    const currentTime = performance.now() / 1000;
    const deltaTime = currentTime - lastTime;

    // Update our tracking variables
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

    // Get current point size - this allows for dynamic changes based on collapsed/expanded state
    const pointSize = getPointSize();

    // Calculate new position
    const position = calculateCircularPosition(
      containerWidth,
      containerHeight,
      angle,
      radius,
      pointSize.width,
      pointSize.height,
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
