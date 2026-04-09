interface BodyAvatarProps {
  shape?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const shapeColors: Record<string, string> = {
  hourglass: "#818cf8",
  pear: "#a78bfa",
  apple: "#f472b6",
  rectangle: "#60a5fa",
  "inverted-triangle": "#34d399",
};

export default function BodyAvatar({ shape = "rectangle", size = "md", className = "" }: BodyAvatarProps) {
  const color = shapeColors[shape] ?? "#818cf8";
  const dims = size === "sm" ? 80 : size === "md" ? 160 : 240;

  return (
    <svg
      width={dims}
      height={dims * 1.8}
      viewBox="0 0 100 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label={`${shape} body shape avatar`}
    >
      {/* Head */}
      <ellipse cx="50" cy="18" rx="12" ry="14" fill={color} opacity="0.9" />

      {/* Neck */}
      <rect x="46" y="30" width="8" height="8" fill={color} opacity="0.8" />

      {/* Body - varies by shape */}
      {shape === "hourglass" && (
        <path
          d="M30 38 Q50 42 70 38 L75 80 Q60 90 50 92 Q40 90 25 80 Z"
          fill={color}
          opacity="0.85"
        />
      )}
      {shape === "pear" && (
        <path
          d="M34 38 Q50 40 66 38 L72 80 Q62 95 50 96 Q38 95 28 80 Z"
          fill={color}
          opacity="0.85"
        />
      )}
      {shape === "apple" && (
        <path
          d="M32 38 Q50 36 68 38 L74 78 Q60 88 50 90 Q40 88 26 78 Z"
          fill={color}
          opacity="0.85"
        />
      )}
      {shape === "rectangle" && (
        <path
          d="M33 38 Q50 40 67 38 L70 82 Q60 88 50 88 Q40 88 30 82 Z"
          fill={color}
          opacity="0.85"
        />
      )}
      {shape === "inverted-triangle" && (
        <path
          d="M26 38 Q50 44 74 38 L72 80 Q60 88 50 88 Q40 88 28 80 Z"
          fill={color}
          opacity="0.85"
        />
      )}

      {/* Left arm */}
      <path d="M30 42 Q18 60 20 78" stroke={color} strokeWidth="8" strokeLinecap="round" />
      {/* Right arm */}
      <path d="M70 42 Q82 60 80 78" stroke={color} strokeWidth="8" strokeLinecap="round" />

      {/* Left leg */}
      <path d="M38 90 Q35 120 33 150" stroke={color} strokeWidth="9" strokeLinecap="round" />
      {/* Right leg */}
      <path d="M62 90 Q65 120 67 150" stroke={color} strokeWidth="9" strokeLinecap="round" />

      {/* Left foot */}
      <ellipse cx="31" cy="153" rx="8" ry="4" fill={color} opacity="0.7" />
      {/* Right foot */}
      <ellipse cx="69" cy="153" rx="8" ry="4" fill={color} opacity="0.7" />
    </svg>
  );
}
