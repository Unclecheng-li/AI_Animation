export function mountBeatText(container, text, { size = 40, startOffset = 0, beatDuration } = {}) {
  const element = document.createElement("div");
  element.textContent = text;
  element.style.cssText = `
    opacity: 0;
    transform: translateY(14px);
    font-family: Inter, sans-serif;
    font-weight: 600;
    font-size: ${size}px;
    color: white;
    letter-spacing: -0.5px;
    text-align: center;
  `;
  container.appendChild(element);

  const timeline = gsap.timeline();
  timeline.to(element, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, startOffset);
  if (beatDuration != null) {
    timeline.to(element, { opacity: 0, duration: 0.6, ease: "none" }, startOffset + beatDuration - 0.6);
  }
  return timeline;
}
