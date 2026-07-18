const fs = require('fs');

// Fix App.css
let appCss = fs.readFileSync('src/App.css', 'utf8');
appCss = appCss.replace(/background:\s*linear-gradient\(135deg,\s*var\(--accent-gold\)\s*0%,\s*#ca9b09\s*100%\);/g, 'background: var(--accent-gold);');
appCss = appCss.replace(/color:\s*#0b0d13;/g, 'color: #ffffff;');
fs.writeFileSync('src/App.css', appCss);

// Fix App.tsx
let appTsx = fs.readFileSync('src/App.tsx', 'utf8');

// Replace standard gradient buttons (green, blue, yellow) with var(--accent-blue) or flat colors
appTsx = appTsx.replace(/'linear-gradient\(135deg,\s*#10b981,\s*#059669\)'/g, "'#1877f2'"); // green gradient to blue
appTsx = appTsx.replace(/'linear-gradient\(135deg,\s*#10b981\s*0%,\s*#059669\s*100%\)'/g, "'#1877f2'");
appTsx = appTsx.replace(/'linear-gradient\(135deg,\s*#06b6d4,\s*#3b82f6\)'/g, "'var(--bg-surface)'"); // blue gradient to surface
appTsx = appTsx.replace(/'linear-gradient\(135deg,\s*#eab308,\s*#f59e0b\)'/g, "'#1877f2'"); // yellow gradient to blue
appTsx = appTsx.replace(/color:\s*'#000'/g, "color: '#ffffff'");

// Replace weird background gradients with solid light theme variables or subtle black transparency
appTsx = appTsx.replace(/'linear-gradient\(135deg,\s*rgba\(226,\s*183,\s*20,\s*0\.12\)\s*0%,\s*rgba\(16,\s*185,\s*129,\s*0\.08\)\s*100%\)'/g, "'rgba(0,0,0,0.02)'");
appTsx = appTsx.replace(/'linear-gradient\(135deg,\s*rgba\(16,\s*185,\s*129,\s*0\.12\),\s*rgba\(245,\s*158,\s*11,\s*0\.08\)\)'/g, "'rgba(0,0,0,0.02)'");
appTsx = appTsx.replace(/'linear-gradient\(to top,\s*rgba\(11,13,19,0\.9\),\s*transparent\)'/g, "'linear-gradient(to top, rgba(0,0,0,0.8), transparent)'");
appTsx = appTsx.replace(/'linear-gradient\(90deg,\s*transparent,\s*rgba\(226,\s*183,\s*20,\s*0\.03\)\)'/g, "'transparent'");

fs.writeFileSync('src/App.tsx', appTsx);

console.log('Successfully cleaned up gradients');
