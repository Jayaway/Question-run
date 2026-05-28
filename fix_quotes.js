const fs = require('fs');
const raw = fs.readFileSync('/Users/vv/Downloads/刷题网页/data.js');
const c = raw.toString('utf8');
const stripped = c.replace(/^window\.QUESTION_BANK\s*=\s*/, '').replace(/\s*;[\s\n]*$/, '').trim();

function fixLine(line) {
  let result = '';
  let inString = false;
  let escapeNext = false;
  let changed = false;
  let i = 0;

  while (i < line.length) {
    const ch = line[i];

    if (escapeNext) {
      result += ch;
      i++;
      escapeNext = false;
      continue;
    }

    if (ch === '\\') {
      result += ch;
      i++;
      escapeNext = true;
      continue;
    }

    if (ch === '"') {
      if (!inString) {
        // Start of a string
        inString = true;
        result += ch;
        i++;
      } else {
        // Inside a string, see a quote
        // Find what comes after (skip whitespace)
        let j = i + 1;
        while (j < line.length && (line[j] === ' ' || line[j] === '\t')) j++;
        const next = line[j];

        // Valid closing patterns: followed by , } ] \n \r or end of line
        const isClosing = (
          j >= line.length ||
          next === ',' || next === '}' || next === ']' ||
          next === '\n' || next === '\r'
        );

        if (isClosing) {
          inString = false;
          result += ch;
          i++;
        } else {
          // Inner quote — escape it
          result += '\\"';
          changed = true;
          i++; // skip this quote, continue
        }
      }
      continue;
    }

    result += ch;
    i++;
  }

  return { fixed: result, changed };
}

const lines = stripped.split('\n');
let totalChanges = 0;
let changedLines = [];

for (let i = 0; i < lines.length; i++) {
  const { fixed, changed } = fixLine(lines[i]);
  if (changed) {
    console.log('Line ' + (i + 1) + ' fixed');
    changedLines.push(i + 1);
    totalChanges++;
  }
  lines[i] = fixed;
}

console.log('Total lines changed:', totalChanges);
console.log('Changed line numbers:', changedLines);

const fixed = lines.join('\n');
try {
  JSON.parse(fixed);
  console.log('JSON is VALID!');
  fs.writeFileSync('/Users/vv/Downloads/刷题网页/data.js', 'window.QUESTION_BANK = ' + fixed + ';');
  console.log('File saved!');
} catch (e) {
  console.log('Still invalid:', e.message);
  const m = e.message.match(/position (\d+)/);
  if (m) {
    const pos = parseInt(m[1]);
    const ctx = fixed.substring(Math.max(0, pos - 100), pos + 100);
    console.log('Context:', JSON.stringify(ctx));
    const errLines = fixed.substring(0, pos).split('\n');
    const col = pos - errLines.slice(0, -1).join('\n').length - 1;
    console.log('Error at line', errLines.length, 'col', col);
  }
}