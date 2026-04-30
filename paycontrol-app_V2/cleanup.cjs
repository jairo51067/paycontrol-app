s:\Carpeta Windows\Pictures\Screenshots\estructura del proyecto appcontrol_2026-04-27.pngconst fs = require('fs');

const files = [
  'fix-reset.js',
  'write-reset.cjs',
  'check-divs.cjs',
  'fix-div.cjs',
  'find-divs.cjs',
  'write-reset.ps1',
  'write-reset2.cjs',
  'inspect.cjs',
  'fix-final.cjs',
  'fix-now.cjs',
  'verify-and-rename.cjs',
  'readme.txt',
  'test-component.jsx',
  'write-fixed.cjs'
];

files.forEach((f) => {
  try {
    fs.unlinkSync(f);
    console.log('Deleted:', f);
  } catch (e) {
    console.log('Skipped:', f);
  }
});
