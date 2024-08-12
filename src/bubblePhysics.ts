interface Bubble {
  x: number;
  y: number;
  vx: number;
  vy: number;
  containerWidth: number;
  containerHeight: number;
}

export interface AnimationConfig {
  brownianStrength: number;
  springConstant: number;
  boundaryStrength: number;
  damping: number;
  timeScale: number;
}

export function createBubble(
  x: number,
  y: number,
  containerWidth: number,
  containerHeight: number,
): Bubble {
  return { x, y, vx: 0, vy: 0, containerWidth, containerHeight };
}

export function applyBrownianForce(bubble: Bubble, strength: number) {
  bubble.vx += (Math.random() - 0.5) * strength;
  bubble.vy += (Math.random() - 0.5) * strength;
}

export function applySpringForce(bubble: Bubble, springConstant: number) {
  const centerX = bubble.containerWidth / 2;
  const centerY = bubble.containerHeight / 2;
  bubble.vx += (centerX - bubble.x) * springConstant;
  bubble.vy += (centerY - bubble.y) * springConstant;
}

export function applyBoundaryForce(bubble: Bubble, boundaryStrength: number) {
  const distanceFromEdgeX = Math.min(
    bubble.x,
    bubble.containerWidth - bubble.x,
  );
  const distanceFromEdgeY = Math.min(
    bubble.y,
    bubble.containerHeight - bubble.y,
  );
  const forceX = Math.max(0, boundaryStrength - distanceFromEdgeX);
  const forceY = Math.max(0, boundaryStrength - distanceFromEdgeY);

  bubble.vx += forceX * (bubble.x < bubble.containerWidth / 2 ? 1 : -1);
  bubble.vy += forceY * (bubble.y < bubble.containerHeight / 2 ? 1 : -1);
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
  applyBrownianForce(bubble, config.brownianStrength * config.timeScale);
  applySpringForce(bubble, config.springConstant * config.timeScale);
  applyBoundaryForce(bubble, config.boundaryStrength);
  updateBubblePosition(bubble, config.damping, config.timeScale);
  onUpdate(bubble.x, bubble.y);
}
