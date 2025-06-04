// components/BølgeBakgrunn.tsx – Dekorativ mockup-bakgrunn
export default function BølgeBakgrunn() {
  return (
    <svg
      viewBox="0 0 1440 320"
      className="absolute top-0 left-0 w-full h-[300px] z-0"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="waveGradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#FF7E05" />
          <stop offset="50%" stopColor="#FEC83C" />
          <stop offset="100%" stopColor="#FFF0B8" />
        </linearGradient>
      </defs>
      <path
        fill="url(#waveGradient)"
        d="M0,128L60,133.3C120,139,240,149,360,170.7C480,192,600,224,720,218.7C840,213,960,171,1080,138.7C1200,107,1320,85,1380,74.7L1440,64V0H1380C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0H0Z"
        opacity="0.3"
      />
    </svg>
  );
}
