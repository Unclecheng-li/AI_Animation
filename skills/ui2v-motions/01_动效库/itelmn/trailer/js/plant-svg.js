const GROUND = '<ellipse cx="60" cy="102" rx="52" ry="6" fill="currentColor" opacity="0.15"></ellipse>';

const GLYPHS = {
  seed: `
    <path d="M44 100 Q60 94 76 100 Q76 103 60 104 Q44 103 44 100 Z" fill="#8b5a3c"></path>
    <ellipse cx="60" cy="98" rx="6" ry="4" fill="#5a3a26"></ellipse>`,
  sprout: `
    <path d="M44 100 Q60 94 76 100 Q76 103 60 104 Q44 103 44 100 Z" fill="#8b5a3c"></path>
    <line x1="60" y1="94" x2="60" y2="80" stroke="#87a635" stroke-width="2" stroke-linecap="round"></line>
    <path d="M60 82 Q52 78 50 70 Q58 72 60 82" fill="#ccff00"></path>
    <path d="M60 84 Q68 80 70 72 Q62 74 60 84" fill="#b3e600"></path>`,
  sapling: `
    <path d="M44 100 Q60 94 76 100 Q76 103 60 104 Q44 103 44 100 Z" fill="#8b5a3c"></path>
    <line x1="60" y1="94" x2="60" y2="60" stroke="#87a635" stroke-width="2.5" stroke-linecap="round"></line>
    <path d="M60 80 Q48 74 44 60 Q58 64 60 80" fill="#ccff00"></path>
    <path d="M60 70 Q72 64 76 50 Q62 54 60 70" fill="#b3e600"></path>
    <path d="M60 62 Q52 56 50 44 Q58 48 60 62" fill="#ccff00" opacity="0.9"></path>`,
  young_tree: `
    <path d="M44 100 Q60 94 76 100 Q76 103 60 104 Q44 103 44 100 Z" fill="#8b5a3c"></path>
    <path d="M57 96 L57 54 L63 54 L63 96 Z" fill="#8b5a3c"></path>
    <circle cx="60" cy="42" r="24" fill="#ccff00"></circle>
    <circle cx="46" cy="50" r="12" fill="#b3e600"></circle>
    <circle cx="74" cy="50" r="12" fill="#b3e600"></circle>`,
  mature_tree: `
    <path d="M44 100 Q60 94 76 100 Q76 103 60 104 Q44 103 44 100 Z" fill="#8b5a3c"></path>
    <path d="M55 96 L55 48 L65 48 L65 96 Z" fill="#8b5a3c"></path>
    <path d="M60 72 L50 80 L50 78 L58 68 Z" fill="#8b5a3c"></path>
    <path d="M60 72 L70 80 L70 78 L62 68 Z" fill="#8b5a3c"></path>
    <circle cx="60" cy="36" r="28" fill="#ccff00"></circle>
    <circle cx="40" cy="48" r="16" fill="#b3e600"></circle>
    <circle cx="80" cy="48" r="16" fill="#b3e600"></circle>
    <circle cx="60" cy="20" r="14" fill="#e5ff4d"></circle>`,
  blooming: `
    <path d="M44 100 Q60 94 76 100 Q76 103 60 104 Q44 103 44 100 Z" fill="#8b5a3c"></path>
    <path d="M55 96 L55 48 L65 48 L65 96 Z" fill="#8b5a3c"></path>
    <path d="M60 72 L48 80 L48 78 L58 68 Z" fill="#8b5a3c"></path>
    <path d="M60 72 L72 80 L72 78 L62 68 Z" fill="#8b5a3c"></path>
    <circle cx="60" cy="34" r="30" fill="#ccff00"></circle>
    <circle cx="36" cy="48" r="18" fill="#b3e600"></circle>
    <circle cx="84" cy="48" r="18" fill="#b3e600"></circle>
    <circle cx="60" cy="16" r="16" fill="#e5ff4d"></circle>
    <circle cx="42" cy="38" r="3" fill="#fff"></circle>
    <circle cx="78" cy="34" r="3" fill="#fff"></circle>
    <circle cx="60" cy="26" r="2.5" fill="#fff"></circle>
    <circle cx="50" cy="52" r="2.5" fill="#fff"></circle>
    <circle cx="70" cy="56" r="3" fill="#fff"></circle>
    <circle cx="30" cy="58" r="2.5" fill="#fff"></circle>
    <circle cx="90" cy="56" r="2.5" fill="#fff"></circle>`,
};

export const PLANT_STAGES = ["seed", "sprout", "sapling", "young_tree", "mature_tree", "blooming"];

export function buildPlantSvg(stage, { size = 220, rotateDeg = 0 } = {}) {
  return `<svg viewBox="0 0 120 120" width="${size}" height="${size}" role="img">
    ${GROUND}
    <g style="transform-origin:60px 100px; transform:rotate(${rotateDeg}deg)">${GLYPHS[stage]}</g>
  </svg>`;
}
