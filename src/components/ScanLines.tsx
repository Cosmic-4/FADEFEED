export default function ScanLines() {
  return (
    <>
      {/* Scan-line overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-[80] opacity-[0.025]"
        style={{
          background:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
        }}
      />
      {/* Film grain SVG */}
      <div className="fixed inset-0 pointer-events-none z-[81] opacity-[0.03] mix-blend-overlay">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <filter id="filmgrain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#filmgrain)" />
        </svg>
      </div>
    </>
  );
}
