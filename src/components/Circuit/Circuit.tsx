import styles from './Circuit.module.css';

// Traces start on the bottom edge (y = 60) and branch upward, ending in vias.
const TRACES = [
  { d: 'M10 60V48L22 36H90L100 26H140', via: [140, 26] },
  { d: 'M40 60V52H120L130 42H200', via: [200, 42] },
  { d: 'M150 60V54L160 44H230L242 32H300', via: [300, 32] },
  { d: 'M90 36L96 30V16H112', via: [112, 16] },
  { d: 'M260 60V50H282', via: [282, 50] },
];

type CircuitProps = {
  className?: string;
};

export default function Circuit({ className = '' }: CircuitProps) {
  return (
    <svg
      className={`${styles.circuit} ${className}`}
      viewBox="0 0 320 60"
      preserveAspectRatio="xMinYMax slice"
      aria-hidden="true"
    >
      <g className={styles.traces}>
        {TRACES.map((trace, i) => (
          <g key={i}>
            <path d={trace.d} />
            <circle cx={trace.via[0]} cy={trace.via[1]} r="2.5" />
          </g>
        ))}
      </g>
      <g className={styles.pulses}>
        {TRACES.map((trace, i) => (
          <path
            key={i}
            d={trace.d}
            pathLength={100}
            style={{ animationDelay: `${i * 1.3}s` }}
          />
        ))}
      </g>
    </svg>
  );
}
