const fs = require('fs');

const size = 15;
let svg = `<svg width="40" height="40" viewBox="0 0 150 150" fill="white" xmlns="http://www.w3.org/2000/svg" class="opacity-90">\n`;

const sPath = [
    "  XXXXX  ",
    " XX   XX ",
    "XX       ",
    "XX       ",
    " XXXXX   ",
    "   XXXXX ",
    "       XX",
    "       XX",
    " XX   XX ",
    "  XXXXX  "
];

for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
        if ((x + y) % 2 !== 0) continue; // Checkerboard
        
        const cx = 150/2;
        const cy = 150/2;
        const px = x * 10 + 5;
        const py = y * 10 + 5;
        
        const dist = Math.sqrt(Math.pow(px - cx, 2) + Math.pow(py - cy, 2));
        if (dist > 75) continue; // outside circle
        
        const sy = Math.floor((y / size) * sPath.length);
        const sx = Math.floor((x / size) * sPath[0].length);
        
        let isS = false;
        if (sPath[sy] && sPath[sy][sx] === 'X') {
            isS = true;
        }
        
        if (isS) {
            svg += `  <circle cx="${px}" cy="${py}" r="3.5" opacity="1"/>\n`;
        } else {
            const op = Math.max(0.1, 0.4 - (dist/75)*0.3).toFixed(2);
            svg += `  <circle cx="${px}" cy="${py}" r="2" opacity="${op}"/>\n`;
        }
    }
}
svg += `</svg>`;
fs.writeFileSync('logo.svg', svg);
console.log(svg);
