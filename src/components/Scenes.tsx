/**
 * Self-contained SVG scene illustrations for the showcase.
 * No external image dependencies. They render identically offline and
 * adopt the brand palette through currentColor / token-driven fills.
 */

interface SceneProps { className?: string }

const stroke = 'rgb(var(--accent-strong))'
const soft = 'rgb(var(--accent) / 0.18)'
const line = 'rgb(var(--line))'

export function DeskScene({ className = '' }: SceneProps) {
  return (
    <svg viewBox="0 0 300 380" className={className} preserveAspectRatio="xMidYMid slice" role="img" aria-label="A quiet writing desk">
      <rect width="300" height="380" fill="rgb(var(--raised))" />
      {/* window light */}
      <rect x="30" y="24" width="120" height="150" rx="6" fill={soft} />
      <line x1="90" y1="24" x2="90" y2="174" stroke={line} strokeWidth="2" />
      <line x1="30" y1="99" x2="150" y2="99" stroke={line} strokeWidth="2" />
      {/* desk */}
      <rect x="0" y="250" width="300" height="130" fill="rgb(var(--surface))" />
      <rect x="0" y="246" width="300" height="8" fill={soft} />
      {/* notebook */}
      <rect x="60" y="262" width="120" height="86" rx="4" fill="rgb(var(--raised))" stroke={stroke} strokeWidth="2" />
      <line x1="120" y1="262" x2="120" y2="348" stroke={line} strokeWidth="1.5" />
      <line x1="74" y1="284" x2="106" y2="284" stroke={line} strokeWidth="2" />
      <line x1="74" y1="298" x2="106" y2="298" stroke={line} strokeWidth="2" />
      <line x1="74" y1="312" x2="100" y2="312" stroke={line} strokeWidth="2" />
      {/* pen */}
      <rect x="150" y="300" width="70" height="6" rx="3" fill={stroke} transform="rotate(-18 150 300)" />
      {/* cup */}
      <rect x="208" y="300" width="34" height="38" rx="4" fill="rgb(var(--surface))" stroke={stroke} strokeWidth="2" />
      <path d="M242 308 q12 2 12 12 t-12 12" fill="none" stroke={stroke} strokeWidth="2" />
      <path d="M218 292 q-3 -8 2 -14 M228 292 q-3 -8 2 -14" fill="none" stroke={soft} strokeWidth="2" />
    </svg>
  )
}

export function CoffeeScene({ className = '' }: SceneProps) {
  return (
    <svg viewBox="0 0 300 220" className={className} preserveAspectRatio="xMidYMid slice" role="img" aria-label="Morning coffee">
      <rect width="300" height="220" fill="rgb(var(--raised))" />
      <ellipse cx="150" cy="200" rx="120" ry="14" fill={soft} />
      <path d="M96 96 h108 l-10 86 a14 14 0 0 1 -14 12 h-46 a14 14 0 0 1 -14 -12 z"
        fill="rgb(var(--surface))" stroke={stroke} strokeWidth="2.5" />
      <ellipse cx="150" cy="96" rx="54" ry="12" fill={soft} stroke={stroke} strokeWidth="2.5" />
      <path d="M204 110 q34 4 34 34 t-36 32" fill="none" stroke={stroke} strokeWidth="2.5" />
      <path d="M132 64 q-5 -14 4 -26 M150 64 q-5 -14 4 -26 M168 64 q-5 -14 4 -26"
        fill="none" stroke={soft} strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

export function PaperScene({ className = '' }: SceneProps) {
  return (
    <svg viewBox="0 0 300 220" className={className} preserveAspectRatio="xMidYMid slice" role="img" aria-label="Pages and ideas">
      <rect width="300" height="220" fill="rgb(var(--raised))" />
      <g transform="rotate(-6 150 110)">
        <rect x="70" y="40" width="160" height="150" rx="5" fill="rgb(var(--surface))" stroke={line} strokeWidth="2" />
      </g>
      <g transform="rotate(3 150 110)">
        <rect x="78" y="46" width="150" height="140" rx="5" fill="rgb(var(--surface))" stroke={stroke} strokeWidth="2" />
        <line x1="96" y1="74" x2="210" y2="74" stroke={line} strokeWidth="2.5" />
        <line x1="96" y1="92" x2="210" y2="92" stroke={line} strokeWidth="2.5" />
        <line x1="96" y1="110" x2="186" y2="110" stroke={stroke} strokeWidth="2.5" />
        <line x1="96" y1="128" x2="210" y2="128" stroke={line} strokeWidth="2.5" />
        <line x1="96" y1="146" x2="168" y2="146" stroke={line} strokeWidth="2.5" />
      </g>
    </svg>
  )
}

export function WindowScene({ className = '' }: SceneProps) {
  return (
    <svg viewBox="0 0 480 270" className={className} preserveAspectRatio="xMidYMid slice" role="img" aria-label="Calm window light">
      <rect width="480" height="270" fill="rgb(var(--raised))" />
      <rect x="150" y="30" width="180" height="180" rx="8" fill={soft} />
      <line x1="240" y1="30" x2="240" y2="210" stroke={line} strokeWidth="3" />
      <line x1="150" y1="120" x2="330" y2="120" stroke={line} strokeWidth="3" />
      {/* plant */}
      <rect x="356" y="170" width="40" height="40" rx="4" fill="rgb(var(--surface))" stroke={stroke} strokeWidth="2.5" />
      <path d="M376 170 q-18 -34 -40 -40 M376 170 q-4 -40 6 -56 M376 170 q18 -30 42 -34"
        fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />
      {/* horizon line of desk */}
      <rect x="0" y="210" width="480" height="60" fill="rgb(var(--surface))" />
      <rect x="0" y="206" width="480" height="6" fill={soft} />
    </svg>
  )
}
