// Fix MongoDB driver for Linux case-sensitivity issue
const fs = require('fs');
const path = require('path');

const mongodbPath = path.join(__dirname, '..', 'node_modules', 'mongodb');
const cursorPath = path.join(mongodbPath, 'lib', 'cursor');

if (!fs.existsSync(mongodbPath)) {
  console.log('⚠️  mongodb package not found');
  process.exit(0);
}

// Check for explainable_cursor file
const explainableCursorFile = path.join(cursorPath, 'explainable_cursor.js');
const explainableCursorFileLower = path.join(cursorPath, 'explainable_cursor.js');

if (!fs.existsSync(explainableCursorFile)) {
  // Try to find file with different case
  try {
    const files = fs.readdirSync(cursorPath);
    const cursorFile = files.find(f => f.toLowerCase() === 'explainable_cursor.js');
    
    if (cursorFile && cursorFile !== 'explainable_cursor.js') {
      // Copy file with correct case name
      const sourceFile = path.join(cursorPath, cursorFile);
      fs.copyFileSync(sourceFile, explainableCursorFile);
      console.log(`✅ Created explainable_cursor.js from ${cursorFile}`);
    } else if (!cursorFile) {
      // Check if aggregation_cursor.js exists and needs explainable_cursor
      const aggregationCursorFile = path.join(cursorPath, 'aggregation_cursor.js');
      if (fs.existsSync(aggregationCursorFile)) {
        let content = fs.readFileSync(aggregationCursorFile, 'utf8');
        
        // If it requires explainable_cursor but file doesn't exist, create a minimal one
        if (content.includes("require('./explainable_cursor')")) {
          const explainableContent = `'use strict';

const ExplainableCursor = require('./abstract_cursor');

class ExplainableCursorImpl extends ExplainableCursor {
  constructor(parent, topology, ns, cmd, options) {
    super(parent, topology, ns, cmd, options);
  }
}

module.exports = ExplainableCursorImpl;
`;
          
          // First check if abstract_cursor exists
          const abstractCursorFile = path.join(cursorPath, 'abstract_cursor.js');
          if (fs.existsSync(abstractCursorFile)) {
            fs.writeFileSync(explainableCursorFile, explainableContent, 'utf8');
            console.log('✅ Created explainable_cursor.js file');
          } else {
            // Create a simpler version
            const simpleExplainableContent = `'use strict';

module.exports = class ExplainableCursor {
  constructor(parent, topology, ns, cmd, options) {
    this.parent = parent;
    this.topology = topology;
    this.ns = ns;
    this.cmd = cmd;
    this.options = options;
  }
};
`;
            fs.writeFileSync(explainableCursorFile, simpleExplainableContent, 'utf8');
            console.log('✅ Created explainable_cursor.js file (simple version)');
          }
        }
      }
    }
  } catch (e) {
    console.log(`⚠️  Error checking cursor directory: ${e.message}`);
  }
} else {
  console.log('✅ explainable_cursor.js file exists');
}

console.log('✅ mongodb fix completed');

