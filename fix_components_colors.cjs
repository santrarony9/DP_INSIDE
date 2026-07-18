const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace colors
  content = content.replace(/#34d399/gi, '#16a34a'); // light green -> dark green
  content = content.replace(/#fb7185/gi, '#e11d48'); // light pink -> dark rose
  content = content.replace(/#ef4444/gi, '#dc2626'); // light red -> dark red
  content = content.replace(/#f59e0b/gi, '#d97706'); // light amber -> dark amber
  content = content.replace(/#10b981/gi, '#16a34a'); // emerald -> green
  content = content.replace(/#67e8f9/gi, '#0284c7'); // cyan -> sky
  content = content.replace(/#fcd34d/gi, '#d97706'); // yellow -> amber
  
  // Replace white text on white bg
  content = content.replace(/color:\s*'#fff'/gi, "color: 'var(--text-main)'");
  content = content.replace(/color:\s*'#ffffff'/gi, "color: 'var(--text-main)'");

  // Replace translucent whites (from dark theme) with translucent blacks (for light theme)
  content = content.replace(/rgba\(255,\s*255,\s*255,\s*0\.0[1-9]\)/g, 'rgba(0,0,0,0.05)');

  // Fix var(--bg-darkest) to var(--bg-surface) if it looks bad
  content = content.replace(/var\(--bg-darkest\)/g, 'var(--bg-surface)');
  
  fs.writeFileSync(filePath, content);
}

const componentsDir = 'src/components';
fs.readdirSync(componentsDir).forEach(file => {
  if (file.endsWith('.tsx')) {
    replaceInFile(path.join(componentsDir, file));
  }
});

console.log('Successfully updated component colors');
