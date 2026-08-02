/**
 * Simple radar/signal illustration for the empty workspace state.
 * Hand-drawn inline SVG, no external image assets.
 */
export function EmptyStateIllustration() {
  return (
    <svg
      width="140"
      height="140"
      viewBox="0 0 140 140"
      fill="none"
      role="img"
      aria-label="Radar illustration representing no active signal"
    >
      <circle cx="70" cy="70" r="54" stroke="#5CF2FF" strokeOpacity="0.2" strokeWidth="1" />
      <circle cx="70" cy="70" r="38" stroke="#5CF2FF" strokeOpacity="0.3" strokeWidth="1" />
      <circle cx="70" cy="70" r="22" stroke="#5CF2FF" strokeOpacity="0.4" strokeWidth="1" />
      <line
        x1="70"
        y1="70"
        x2="70"
        y2="16"
        stroke="#00F59B"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.55"
      />
      <circle cx="70" cy="70" r="3" fill="#00F59B" />
      <circle cx="96" cy="44" r="2.5" fill="#5CF2FF" opacity="0.75" />
      <circle cx="46" cy="92" r="2" fill="#5CF2FF" opacity="0.55" />
      <circle cx="100" cy="98" r="2" fill="#FF4D6D" opacity="0.45" />
    </svg>
  );
}
