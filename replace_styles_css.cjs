const fs = require('fs');
let css = fs.readFileSync('src/App.css', 'utf8');

// Replace translucent white backgrounds with translucent black (for light theme)
css = css.replace(/rgba\(255,\s*255,\s*255,\s*0\.0[1234567]\)/g, 'rgba(0,0,0,0.02)');
css = css.replace(/rgba\(255,\s*255,\s*255,\s*0\.08\)/g, 'rgba(0,0,0,0.04)');
css = css.replace(/rgba\(255,\s*255,\s*255,\s*0\.1\)/g, 'rgba(0,0,0,0.05)');
css = css.replace(/rgba\(255,\s*255,\s*255,\s*0\.15\)/g, 'rgba(0,0,0,0.08)');
css = css.replace(/rgba\(255,\s*255,\s*255,\s*0\.16\)/g, 'rgba(0,0,0,0.08)');
css = css.replace(/rgba\(255,\s*255,\s*255,\s*0\.35\)/g, 'rgba(0,0,0,0.12)');
css = css.replace(/rgba\(255,\s*255,\s*255,\s*0\.8\)/g, 'rgba(255,255,255,0.95)');

// specific dark backgrounds
css = css.replace(/background:\s*rgba\(11,\s*13,\s*19,\s*0\.85\);/g, 'background: rgba(255, 255, 255, 0.85);');
css = css.replace(/background:\s*rgba\(21,\s*25,\s*36,\s*0\.95\);/g, 'background: rgba(255, 255, 255, 0.95);');

// brand icon color
css = css.replace(/color:\s*#0b0d13;/g, 'color: #ffffff;');

fs.writeFileSync('src/App.css', css);
console.log('Successfully replaced styles in App.css');
