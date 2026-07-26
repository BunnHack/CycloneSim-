const fs = require('fs');
const path = require('path');

const files = [
  'p5-shim.ts',
  'constants.ts',
  'storm.ts',
  'ui.ts',
  'environment.ts',
  'sim-mode-defs.ts',
  'basin.ts',
  'designations.ts',
  'scale.ts',
  'coordinate.ts',
  'misc.ts',
  'worker.ts',
  'sketch.ts',
  'version.ts'
];

console.log('Concatenating TypeScript files into a single bundle: src/app-all.ts...');

let concatenated = `// Auto-generated unified bundle for Cyclone Simulator
// Combines all modules into a single compilation context.

`;

for (const file of files) {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`- Adding ${file}...`);
    const content = fs.readFileSync(filePath, 'utf8');
    concatenated += `\n\n// --- START OF FILE: ${file} ---\n\n` + content;
  } else {
    console.warn(`Warning: file not found: ${file}`);
  }
}

const outDir = path.join(__dirname, 'src');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir);
}

concatenated += `

// Expose p5-style lifecycle and input callbacks from the ES module.
Object.assign(window, {
  setup,
  draw,
  mouseClicked,
  keyPressed,
  keyTyped,
  keyReleased,
  seasonalSine,
  spookySeasonCurve
});
`;

fs.writeFileSync(path.join(outDir, 'app-all.ts'), concatenated, 'utf8');
console.log('Successfully created src/app-all.ts!');
