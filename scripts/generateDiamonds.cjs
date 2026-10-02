const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../public/assets/diamonds');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const generateSvg = (shape, facets) => `
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400' width='100%' height='100%'>
  <defs>
    <radialGradient id='bgGrad' cx='50%' cy='50%' r='75%'>
      <stop offset='0%' stop-color='#0F172A'/>
      <stop offset='60%' stop-color='#0B131F'/>
      <stop offset='100%' stop-color='#050811'/>
    </radialGradient>
    <linearGradient id='diamondSparkle' x1='0%' y1='0%' x2='100%' y2='100%'>
      <stop offset='0%' stop-color='#FFFFFF' stop-opacity='0.95'/>
      <stop offset='30%' stop-color='#E0F2FE' stop-opacity='0.85'/>
      <stop offset='70%' stop-color='#38BDF8' stop-opacity='0.6'/>
      <stop offset='100%' stop-color='#34D399' stop-opacity='0.75'/>
    </linearGradient>
    <filter id='glow' x='-20%' y='-20%' width='140%' height='140%'>
      <feGaussianBlur stdDeviation='10' result='blur'/>
      <feComposite in='SourceGraphic' in2='blur' operator='over'/>
    </filter>
  </defs>

  <rect width='400' height='400' fill='url(#bgGrad)'/>
  <circle cx='200' cy='200' r='120' fill='#0EA5E9' opacity='0.15' filter='url(#glow)'/>

  <!-- Shape Facets -->
  <g transform='translate(200, 200) scale(1.3)' stroke='#38BDF8' stroke-width='1.5' stroke-linejoin='round' fill='url(#diamondSparkle)'>
    ${facets}
  </g>

  <!-- Sparkle Stars -->
  <path d='M200 50 L204 70 L224 74 L204 78 L200 98 L196 78 L176 74 L196 70 Z' fill='#34D399' opacity='0.8' filter='url(#glow)'/>
  <path d='M330 180 L332 190 L342 192 L332 194 L330 204 L328 194 L318 192 L328 190 Z' fill='#38BDF8' opacity='0.85'/>
  <path d='M70 280 L72 290 L82 292 L72 294 L70 304 L68 294 L58 292 L68 290 Z' fill='#FFFFFF' opacity='0.9'/>

  <text x='200' y='360' text-anchor='middle' fill='#94A3B8' font-family='sans-serif' font-size='12' font-weight='bold' letter-spacing='2'>
    ${shape.toUpperCase()} LOOSE DIAMOND 360°
  </text>
</svg>
`;

const shapes = {
  round: `<polygon points='0,-80 40,-70 70,-40 80,0 70,40 40,70 0,80 -40,70 -70,40 -80,0 -70,-40 -40,-70' fill-opacity='0.4'/>
          <polygon points='0,-50 25,-45 45,-25 50,0 45,25 25,45 0,50 -25,45 -45,25 -50,0 -45,-25 -25,-45' fill-opacity='0.6'/>
          <line x1='0' y1='-80' x2='0' y2='80'/>
          <line x1='-80' y1='0' x2='80' y2='0'/>
          <line x1='-56' y1='-56' x2='56' y2='56'/>
          <line x1='-56' y1='56' x2='56' y2='-56'/>`,
  oval: `<polygon points='0,-90 35,-75 55,-40 60,0 55,40 35,75 0,90 -35,75 -55,40 -60,0 -55,-40 -35,-75' fill-opacity='0.45'/>
         <polygon points='0,-60 22,-50 38,-25 40,0 38,25 22,50 0,60 -22,50 -38,25 -40,0 -38,-25 -22,-50' fill-opacity='0.65'/>
         <line x1='0' y1='-90' x2='0' y2='90'/><line x1='-60' y1='0' x2='60' y2='0'/>`,
  emerald: `<polygon points='-50,-80 50,-80 75,-55 75,55 50,80 -50,80 -75,55 -75,-55' fill-opacity='0.4'/>
            <polygon points='-35,-60 35,-60 55,-40 55,40 35,60 -35,60 -55,40 -55,-40' fill-opacity='0.6'/>
            <polygon points='-20,-40 20,-40 35,-25 35,25 20,40 -20,40 -35,25 -35,-25' fill-opacity='0.8'/>`,
  cushion: `<path d='M-50,-70 Q0,-85 50,-70 Q75,-50 75,0 Q75,50 50,70 Q0,85 -50,70 Q-75,50 -75,0 Q-75,-50 -50,-70 Z' fill-opacity='0.45'/>
            <path d='M-30,-45 Q0,-55 30,-45 Q50,-30 50,0 Q50,30 30,45 Q0,55 -30,45 Q-50,30 -50,0 Q-50,-30 -30,-45 Z' fill-opacity='0.65'/>`,
  radiant: `<polygon points='-45,-75 45,-75 70,-50 70,50 45,75 -45,75 -70,50 -70,-50' fill-opacity='0.4'/>
            <polygon points='-30,-55 30,-55 50,-35 50,35 30,55 -30,55 -50,35 -50,-35' fill-opacity='0.65'/>
            <line x1='-45' y1='-75' x2='45' y2='75'/><line x1='45' y1='-75' x2='-45' y2='75'/>`,
  pear: `<path d='M0,-95 C45,-60 70,0 55,45 C40,80 0,90 0,90 C0,90 -40,80 -55,45 C-70,0 -45,-60 0,-95 Z' fill-opacity='0.45'/>
         <path d='M0,-65 C30,-40 45,0 35,30 C25,55 0,60 0,60 C0,60 -25,55 -35,30 C-45,0 -30,-40 0,-65 Z' fill-opacity='0.65'/>`,
  princess: `<polygon points='-70,-70 70,-70 70,70 -70,70' fill-opacity='0.4'/>
             <polygon points='-45,-45 45,-45 45,45 -45,45' fill-opacity='0.6'/>
             <line x1='-70' y1='-70' x2='70' y2='70'/><line x1='70' y1='-70' x2='-70' y2='70'/>`,
  marquise: `<path d='M0,-95 C35,-50 65,-20 65,0 C65,20 35,50 0,95 C-35,50 -65,20 -65,0 C-65,-20 -35,-50 0,-95 Z' fill-opacity='0.45'/>
            <path d='M0,-65 C22,-35 42,-15 42,0 C42,15 22,35 0,65 C-22,35 -42,15 -42,0 C-42,-15 -22,-35 0,-65 Z' fill-opacity='0.65'/>`,
  heart: `<path d='M0,-30 C15,-65 60,-65 65,-25 C70,15 40,45 0,80 C-40,45 -70,15 -65,-25 C-60,-65 -15,-65 0,-30 Z' fill-opacity='0.45'/>
          <path d='M0,-20 C10,-45 40,-45 45,-15 C48,10 25,30 0,55 C-25,30 -48,10 -45,-15 C-40,-45 -10,-45 0,-20 Z' fill-opacity='0.65'/>`,
  asscher: `<polygon points='-50,-50 -20,-75 20,-75 50,-50 75,-20 75,20 50,50 20,75 -20,75 -50,50 -75,20 -75,-20' fill-opacity='0.4'/>
            <polygon points='-35,-35 -15,-52 15,-52 35,-35 52,-15 52,15 35,35 15,52 -15,52 -35,35 -52,15 -52,-15' fill-opacity='0.6'/>
            <polygon points='-20,-20 -8,-30 8,-30 20,-20 30,-8 30,8 20,20 8,30 -8,30 -20,20 -30,8 -30,-8' fill-opacity='0.8'/>`
};

Object.entries(shapes).forEach(([name, facets]) => {
  fs.writeFileSync(path.join(dir, `${name}.svg`), generateSvg(name, facets));
});
console.log('Successfully generated 10 diamond SVG graphics!');
