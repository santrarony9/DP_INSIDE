const fs = require('fs');

let tsx = fs.readFileSync('src/App.tsx', 'utf8');

// Replace light text colors with darker equivalents for readability on white background
tsx = tsx.replace(/#67e8f9/gi, '#0284c7'); // cyan-400 -> sky-600
tsx = tsx.replace(/#34d399/gi, '#16a34a'); // emerald-400 -> green-600
tsx = tsx.replace(/#fcd34d/gi, '#d97706'); // amber-300 -> amber-600
tsx = tsx.replace(/#fb7185/gi, '#e11d48'); // rose-400 -> rose-600
tsx = tsx.replace(/#8b5cf6/gi, '#7c3aed'); // violet-500 -> violet-600
tsx = tsx.replace(/#06b6d4/gi, '#0284c7'); // cyan-500 -> sky-600
tsx = tsx.replace(/#f59e0b/gi, '#d97706'); // amber-500 -> amber-600
tsx = tsx.replace(/#10b981/gi, '#16a34a'); // emerald-500 -> green-600
tsx = tsx.replace(/#ef4444/gi, '#dc2626'); // red-500 -> red-600
tsx = tsx.replace(/#64748b/gi, '#475569'); // slate-500 -> slate-600

// In index.css, also update the badge colors if they were missed.
let css = fs.readFileSync('src/index.css', 'utf8');
css = css.replace(/color:\s*#67e8f9;/gi, 'color: #0284c7;');
css = css.replace(/color:\s*#34d399;/gi, 'color: #16a34a;');
css = css.replace(/color:\s*#fcd34d;/gi, 'color: #d97706;');
css = css.replace(/color:\s*#fb7185;/gi, 'color: #e11d48;');
css = css.replace(/color:\s*#c4b5fd;/gi, 'color: #7c3aed;');
fs.writeFileSync('src/index.css', css);

fs.writeFileSync('src/App.tsx', tsx);
console.log('Successfully fixed text colors');
