const fs = require('fs');
const path = require('path');
function html() {
  return {
    name: 'html',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'index.html',
        source: fs
          .readFileSync(path.join('src', 'stumb', 'index.html'))
          .toString(),
      });
    },
  };
}
export default [
  {
    input: 'src/stumb/index.js',
    output: {
      file: 'public/index.js',
    },
    plugins: [html()],
  },
];
