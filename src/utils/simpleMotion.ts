export function calculateOscillatingPosition(
  containerWidth: number,
  containerHeight: number,
  time: number,
  xFrequency: number,
  yFrequency: number,
  pointWidth: number,
  pointHeight: number,
  xAmpPercent: number,
  yAmpPercent: number,
  deviceType: string,
): { x: number; y: number } {
  // 1. Calculate container center
  const centerX = containerWidth / 2;
  const centerY = containerHeight / 2;

  // Adjust amplitude based on device type
  const ampReductionFactor =
    deviceType === 'desktop' ? 1 : deviceType === 'tablet' ? 1 : 0.25;

  // 2. Calculate maximum possible amplitudes (accounting for element size)
  const maxXAmp = ((containerWidth - pointWidth) / 2) * ampReductionFactor;
  const maxYAmp = (containerHeight - pointHeight) / 2;

  // 3. Apply percentage to get actual amplitudes
  const xAmp = maxXAmp * (xAmpPercent / 100);
  const yAmp = maxYAmp * (yAmpPercent / 100);

  // 4. Calculate oscillation with sine/cosine
  const xOffset = xAmp * Math.sin(time * xFrequency) + 40;
  const yOffset = yAmp * Math.cos(time * yFrequency);

  // 5. Calculate final position (center + offset)
  const x = centerX + xOffset - pointWidth / 2;
  const y = centerY + yOffset - pointHeight / 2;

  return { x, y };
}

export function animateOscillatingMotion(
  onUpdate: (position: { x: number; y: number }) => void,
  containerWidth: number,
  containerHeight: number,
  pointWidth: number,
  pointHeight: number,
  xFrequency: number,
  yFrequency: number,
  xAmpPercent: number,
  yAmpPercent: number,
  deviceType: string,
): () => void {
  // Set up animation state
  let animationFrameId: number;
  let isAnimating = true;
  const startTime = performance.now() / 1000;

  // Animation loop
  const animate = () => {
    if (!isAnimating) return;

    // Calculate elapsed time
    const currentTime = performance.now() / 1000;
    const elapsedTime = currentTime - startTime;

    // Calculate new position
    const position = calculateOscillatingPosition(
      containerWidth,
      containerHeight,
      elapsedTime,
      xFrequency,
      yFrequency,
      pointWidth,
      pointHeight,
      xAmpPercent,
      yAmpPercent,
      deviceType,
    );

    // Update position
    onUpdate(position);

    // Continue animation
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
