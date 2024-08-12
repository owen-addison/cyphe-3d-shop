interface Bubble {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  containerWidth: number;
  containerHeight: number;
  baseSpeed: number; // Add this line
}

export interface AnimationConfig {
  directionChangeRate: number; // Rate at which the bubble changes direction
  repulsionStrength: number; // Strength of boundary repulsion
  timeScale: number; // Overall speed of animation
  baseSpeed: number; // Base speed of the bubble
  edgeBuffer: number; // Distance from edge to start repulsion
}

export function createBubble(
  x: number,
  y: number,
  containerWidth: number,
  containerHeight: number,
  baseSpeed: number,
): Bubble {
  const angle = Math.random() * Math.PI * 2;
  return {
    x,
    y,
    vx: Math.cos(angle) * baseSpeed,
    vy: Math.sin(angle) * baseSpeed,
    angle,
    containerWidth,
    containerHeight,
    baseSpeed,
  };
}

// function updateBubbleDirection(
//   bubble: Bubble,
//   changeRate: number,
//   baseSpeed: number,
// ) {
//   bubble.angle += (Math.random() - 0.5) * changeRate;
//   bubble.vx = Math.cos(bubble.angle) * baseSpeed;
//   bubble.vy = Math.sin(bubble.angle) * baseSpeed;
// }

function applyBoundaryRepulsion(
  bubble: Bubble,
  repulsionStrength: number,
  edgeBuffer: number,
) {
  const leftDist = bubble.x - edgeBuffer;
  const rightDist = bubble.containerWidth - edgeBuffer - bubble.x;
  const topDist = bubble.y - edgeBuffer;
  const bottomDist = bubble.containerHeight - edgeBuffer - bubble.y;

  if (leftDist < 0)
    bubble.vx += repulsionStrength * Math.abs(leftDist / edgeBuffer);
  if (rightDist < 0)
    bubble.vx -= repulsionStrength * Math.abs(rightDist / edgeBuffer);
  if (topDist < 0)
    bubble.vy += repulsionStrength * Math.abs(topDist / edgeBuffer);
  if (bottomDist < 0)
    bubble.vy -= repulsionStrength * Math.abs(bottomDist / edgeBuffer);

  // Normalize velocity to maintain consistent speed
  const speed = Math.sqrt(bubble.vx * bubble.vx + bubble.vy * bubble.vy);
  if (speed > 0) {
    bubble.vx = (bubble.vx / speed) * bubble.baseSpeed;
    bubble.vy = (bubble.vy / speed) * bubble.baseSpeed;
  }
}

export function updateBubblePosition(
  bubble: Bubble,
  damping: number,
  timeScale: number,
) {
  bubble.x += bubble.vx * timeScale;
  bubble.y += bubble.vy * timeScale;
  bubble.vx *= Math.pow(damping, timeScale);
  bubble.vy *= Math.pow(damping, timeScale);
}

export function animateBubble(
  bubble: Bubble,
  onUpdate: (x: number, y: number) => void,
  config: AnimationConfig,
) {
  // Gentle direction change
  bubble.angle += (Math.random() - 0.5) * config.directionChangeRate;

  // Update velocity based on new angle
  bubble.vx = Math.cos(bubble.angle) * config.baseSpeed;
  bubble.vy = Math.sin(bubble.angle) * config.baseSpeed;

  // Apply boundary repulsion
  applyBoundaryRepulsion(bubble, config.repulsionStrength, config.edgeBuffer);

  // Update position
  bubble.x += bubble.vx * config.timeScale;
  bubble.y += bubble.vy * config.timeScale;

  // Ensure bubble stays within container
  bubble.x = Math.max(0, Math.min(bubble.x, bubble.containerWidth));
  bubble.y = Math.max(0, Math.min(bubble.y, bubble.containerHeight));

  onUpdate(bubble.x, bubble.y);
}
