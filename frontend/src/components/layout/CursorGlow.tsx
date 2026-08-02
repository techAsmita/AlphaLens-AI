import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * A soft green radial glow that follows the pointer on devices with a fine
 * pointer (mouse/trackpad). Position is written directly to the DOM via a
 * ref on each animation frame rather than through React state, so the
 * cursor trail never triggers a re-render.
 *
 * Disabled entirely for touch devices and when the user prefers reduced
 * motion.
 */
export function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [hasFinePointer, setHasFinePointer] = useState(false);

  useEffect(() => {
    setHasFinePointer(window.matchMedia("(pointer: fine)").matches);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || !hasFinePointer) return;

    const glow = glowRef.current;
    if (!glow) return;

    let frame = 0;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;

    const handlePointerMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
    };

    const render = () => {
      glow.style.transform = `translate3d(${targetX}px, ${targetY}px, 0) translate(-50%, -50%)`;
      frame = requestAnimationFrame(render);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    frame = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      cancelAnimationFrame(frame);
    };
  }, [prefersReducedMotion, hasFinePointer]);

  if (prefersReducedMotion || !hasFinePointer) return null;

  return (
    <div
      ref={glowRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 -z-10 h-[420px] w-[420px] rounded-full opacity-[0.08] blur-[100px] will-change-transform"
      style={{ backgroundColor: "#00F59B" }}
    />
  );
}
