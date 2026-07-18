const fs = require('fs');

let css = fs.readFileSync('src/App.css', 'utf8');

// Replace kanban dark background
css = css.replace(/background:\s*rgba\(21,\s*25,\s*36,\s*0\.6\);/g, 'background: var(--bg-surface);');

// Replace mobile nav dark background
css = css.replace(/background:\s*rgba\(11,\s*13,\s*19,\s*0\.95\);/g, 'background: var(--bg-glass);');

// Replace any remaining translucent whites
css = css.replace(/rgba\(255,\s*255,\s*255,\s*0\.\d+\)/g, 'rgba(0,0,0,0.03)');

fs.writeFileSync('src/App.css', css);

console.log('Successfully fixed App.css styles');
