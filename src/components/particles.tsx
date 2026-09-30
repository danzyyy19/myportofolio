"use client";

/**
 * Lightweight dot grid background pattern.
 * Replaces the heavy canvas-based particle animation
 * with a pure CSS solution that's mobile-friendly.
 */
export function ParticlesBackground() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <div
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.015]"
        style={{
          backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />
    </div>
  );
}
