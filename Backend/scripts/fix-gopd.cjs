// Fix gopd package for Linux case-sensitivity issue
const fs = require('fs');
const path = require('path');

const gopdPath = path.join(__dirname, '..', 'node_modules', 'gopd');
const indexFile = path.join(gopdPath, 'index.js');
const gOPDFile = path.join(gopdPath, 'gOPD.js');

if (!fs.existsSync(gopdPath)) {
  console.log('⚠️  gopd package not found');
  process.exit(0);
}

// Read all files in gopd directory
let files = [];
try {
  files = fs.readdirSync(gopdPath);
} catch (e) {
  console.log('⚠️  Cannot read gopd directory:', e.message);
  process.exit(0);
}

// Find gopd.js file with any case
const gopdFile = files.find(f => f.toLowerCase() === 'gopd.js');

// Ensure gOPD.js file exists (handle case-sensitivity)
if (!fs.existsSync(gOPDFile)) {
  if (gopdFile) {
    // Copy file with correct case name
    const sourceFile = path.join(gopdPath, gopdFile);
    try {
      fs.copyFileSync(sourceFile, gOPDFile);
      console.log(`✅ Created gOPD.js from ${gopdFile}`);
    } catch (e) {
      console.log(`⚠️  Error copying file: ${e.message}`);
    }
  } else {
    // If no gopd.js file found, create a minimal one
    const gopdContent = `'use strict';

var $gOPD = Object.getOwnPropertyDescriptor;

if ($gOPD) {
  try {
    $gOPD([], 'length');
  } catch (e) {
    // IE 8 has a broken gOPD
    $gOPD = null;
  }
}

module.exports = $gOPD;
`;
    try {
      fs.writeFileSync(gOPDFile, gopdContent, 'utf8');
      console.log('✅ Created gOPD.js file');
    } catch (e) {
      console.log(`⚠️  Error creating gOPD.js: ${e.message}`);
    }
  }
} else {
  console.log('✅ gOPD.js file exists');
}

// Fix index.js to handle case-sensitivity with better fallback
if (fs.existsSync(indexFile)) {
  let indexContent = fs.readFileSync(indexFile, 'utf8');
  
  // Always rewrite index.js to ensure it works on Linux
  const fixedContent = `'use strict';

// case-sensitivity fix for Linux (Windows to Render deployment)
var $gOPD;
try {
  $gOPD = require('./gOPD');
} catch (e) {
  // Fallback: try to find file with any case
  try {
    const fs = require('fs');
    const path = require('path');
    const dir = __dirname;
    const files = fs.readdirSync(dir);
    const gopdFile = files.find(f => f.toLowerCase() === 'gopd.js');
    if (gopdFile) {
      $gOPD = require(path.join(dir, gopdFile));
    } else {
      // Last resort: use Object.getOwnPropertyDescriptor directly
      $gOPD = Object.getOwnPropertyDescriptor;
    }
  } catch (e2) {
    // Final fallback
    $gOPD = Object.getOwnPropertyDescriptor;
  }
}

if ($gOPD) {
  try {
    $gOPD([], 'length');
  } catch (e) {
    // IE 8 has a broken gOPD
    $gOPD = null;
  }
}

module.exports = $gOPD;
`;
  
  try {
    fs.writeFileSync(indexFile, fixedContent, 'utf8');
    console.log('✅ Fixed gopd/index.js for case-sensitivity');
  } catch (e) {
    console.log(`⚠️  Error fixing index.js: ${e.message}`);
  }
} else {
  console.log('⚠️  index.js file not found');
}

console.log('✅ gopd fix completed');
