'use client';

/**
 * Hookpost app mark (square) — the HookStep brand mark.
 *
 * See ui/logo-text.component.tsx for why these reference our own asset file
 * rather than inline paths.
 */
export const Logo = () => {
  return (
    <img
      src="/brand-logo.png"
      alt="Hookpost"
      width={60}
      height={60}
      // min-w-[60px] made this the widest thing in the nav rail: with the
      // rail's padding it forced 71px of min-content, so every page reported
      // horizontal overflow on a narrow screen. Scale the mark down instead.
      className="mt-[8px] w-[40px] h-[40px] min-w-[40px] min-h-[40px] md:w-[60px] md:h-[60px] md:min-w-[60px] md:min-h-[60px]"
    />
  );
};
