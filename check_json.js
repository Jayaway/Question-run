const fs = require('fs');
const raw = fs.readFileSync('/Users/vv/Downloads/刷题网页/data.js');
const c = raw.toString('utf8');
const stripped = c.replace(/^window\.QUESTION_BANK\s*=\s*/, '').replace(/\s*;[\s\n]*$/, '').trim();

// Error at line 2 col 13 = position 14 in the stripped string
console.log('Stripped first 200 chars:');
for (let i = 0; i < Math.min(200, stripped.length); i++) {
  const code = stripped.charCodeAt(i);
  if (code < 32 && code !== 10) {
    console.log('  BAD CHAR at ' + i + ': code=' + code + ' hex=0x' + code.toString(16) + ' char=' + JSON.stringify(stripped[i]));
  }
}

console.log('\nChars 10-20:');
for (let i = 10; i < 20; i++) {
  console.log('  [' + i + '] code=' + stripped.charCodeAt(i) + ' hex=0x' + stripped.charCodeAt(i).toString(16) + ' char=' + JSON.stringify(stripped[i]));
}

console.log('\nLine 2:', JSON.stringify(stripped.split('\n')[1]));

// The previous fix script ran with the IS-CLOSING logic including ':'
// But it only fixed quotes followed by , } ] \n \r or end of line
// It should also fix quotes followed by : since those are part of the structure
// But actually the issue is different - my previous script might have OVER-escaped quotes

// Let me check: what happened to the meta section
const lines = stripped.split('\n');
console.log('\nFirst 5 lines:');
for (let i = 0; i < 5; i++) {
  console.log('Line ' + (i + 1) + ':', JSON.stringify(lines[i]));
}

// The problem: my previous fix script might have double-escaped quotes
// Because the file ALREADY had some properly escaped strings, but my script
// treated "key": "value" quotes differently

// Let me check: are there any \\" in the meta section that should be just \"
console.log('\nMeta title value:');
const metaTitle = lines[1].match(/"title":\s*"(.*)"/);
if (metaTitle) {
  console.log('Title:', JSON.stringify(metaTitle[1]));
  // Check for double-backslash
  console.log('Contains \\\\:', metaTitle[1].includes('\\\\'));
  console.log('Contains single \\":', metaTitle[1].includes('\\"'));
}

// The fix: I need to check if a quote is already escaped (preceded by \)
// If it is, DON'T escape it again
// My fix script DID check for escapeNext, so it should be fine
// But maybe the file was ALREADY fixed and my script double-escaped?

// Let me try a different approach: restore from git or backup, then apply fixes properly
// Actually, let me just check: what does the current file look like?
console.log('\nCurrent first 5 lines (after fix attempt):');
const current = fs.readFileSync('/Users/vv/Downloads/刷题网页/data.js').toString('utf8');
const stripped2 = current.replace(/^window\.QUESTION_BANK\s*=\s*/, '').replace(/\s*;[\s\n]*$/, '').trim();
const lines2 = stripped2.split('\n');
for (let i = 0; i < 5; i++) {
  console.log('Line ' + (i + 1) + ':', lines2[i]);
}

// Now check for the specific bad character
console.log('\nLooking for bad control characters in first 50 chars:');
for (let i = 0; i < 50; i++) {
  const code = stripped2.charCodeAt(i);
  if (code < 32) {
    console.log('  BAD at ' + i + ': code=' + code + ' hex=0x' + code.toString(16));
  }
}

// Check specifically at position 14
console.log('\nChar at pos 14:', stripped2.charCodeAt(14), 'hex=0x' + stripped2.charCodeAt(14).toString(16), JSON.stringify(stripped2[14]));

// Hmm, let me check: is there a control character (0x01-0x1F except \n\t\r) somewhere?
console.log('\nAll control chars in first 200:');
for (let i = 0; i < 200; i++) {
  const code = stripped2.charCodeAt(i);
  if (code < 32 && code !== 10 && code !== 9 && code !== 13) {
    console.log('  BAD at ' + i + ': code=' + code + ' hex=0x' + code.toString(16));
  }
}

// The fix script might have introduced bad chars by double-escaping
// Let me check: what did the fix script do to the "title" value?
// Original: "算法设计与分析复习练习"
// After fix: should still be "算法设计与分析复习练习" with no escape

console.log('\nMeta line full:');
console.log(lines2[1]);

// The issue might be in how my fix script processed lines
// Let me check: is the backslash-quote sequence now double-escaped?
console.log('Meta line contains \\\\:', lines2[1].includes('\\\\'));
console.log('Meta line contains \\":', lines2[1].includes('\\"'));