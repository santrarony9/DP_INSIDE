const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf8');

// Replace translucent white backgrounds with translucent black (for light theme)
app = app.replace(/rgba\(255,\s*255,\s*255,\s*0\.0[123456]\)/g, 'rgba(0,0,0,0.02)');
app = app.replace(/rgba\(255,\s*255,\s*255,\s*0\.08\)/g, 'rgba(0,0,0,0.04)');
app = app.replace(/rgba\(255,\s*255,\s*255,\s*0\.1\)/g, 'rgba(0,0,0,0.05)');
app = app.replace(/rgba\(255,\s*255,\s*255,\s*0\.15\)/g, 'rgba(0,0,0,0.08)');

// Replace hardcoded white text colors with the CSS variable for main text
app = app.replace(/color:\s*'#fff'/g, "color: 'var(--text-main)'");
app = app.replace(/color:\s*"#fff"/g, "color: 'var(--text-main)'");
app = app.replace(/color:\s*'white'/g, "color: 'var(--text-main)'");

fs.writeFileSync('src/App.tsx', app);
console.log('Successfully replaced styles in App.tsx');
