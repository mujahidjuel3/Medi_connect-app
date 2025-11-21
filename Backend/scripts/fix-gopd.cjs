// Fix gopd package for Linux case-sensitivity issue
const fs = require('fs');
const path = require('path');

const gopdPath = path.join(__dirname, '..', 'node_modules', 'gopd');
const indexFile = path.join(gopdPath, 'index.js');

if (!fs.existsSync(gopdPath)) {
  console.log('⚠️  gopd package not found');
  process.exit(0);
}

// Read all files in gopd directory
const files = fs.readdirSync(gopdPath);
const gopdFile = files.find(f => f.toLowerCase() === 'gopd.js');

if (!gopdFile) {
  console.log('⚠️  gOPD.js file not found in gopd package');
  process.exit(0);
}

// If file exists but with different case, ensure it's accessible
if (gopdFile !== 'gOPD.js') {
  const sourceFile = path.join(gopdPath, gopdFile);
  const targetFile = path.join(gopdPath, 'gOPD.js');
  
  // Copy file with correct case name
  if (!fs.existsSync(targetFile)) {
    fs.copyFileSync(sourceFile, targetFile);
    console.log(`✅ Created gOPD.js from ${gopdFile}`);
  }
}

// Fix index.js to handle case-sensitivity
if (fs.existsSync(indexFile)) {
  let indexContent = fs.readFileSync(indexFile, 'utf8');
  
  if (indexContent.includes("require('./gOPD')") && !indexContent.includes('case-sensitivity fix')) {
    const fixedContent = indexContent.replace(
      /var \$gOPD = require\('\.\/gOPD'\);/,
      `// case-sensitivity fix for Linux
var $gOPD;
try {
  $gOPD = require('./gOPD');
} catch (e) {
  // Fallback: try to find file with any case
  const fs = require('fs');
  const files = fs.readdirSync(__dirname);
  const gopdFile = files.find(f => f.toLowerCase() === 'gopd.js');
  if (gopdFile) {
    $gOPD = require('./' + gopdFile);
  } else {
    throw e;
  }
}`
    );
    
    fs.writeFileSync(indexFile, fixedContent, 'utf8');
    console.log('✅ Fixed gopd/index.js for case-sensitivity');
  } else {
    console.log('✅ gopd/index.js is already fixed');
  }
}

console.log('✅ gopd fix completed');

