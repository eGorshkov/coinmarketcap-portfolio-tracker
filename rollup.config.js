import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import css from 'rollup-plugin-css-only';
import { terser } from 'rollup-plugin-terser';
import livereload from 'rollup-plugin-livereload';
import path from 'path';
import fs from 'fs';

const production = !process.env.ROLLUP_WATCH;

function serve() {
  let server;

  function toExit() {
    if (server) server.kill(0);
  }

  return {
    writeBundle() {
      if (server) return;
      server = require('child_process').spawn('npm', ['run', 'start:server'], {
        stdio: ['ignore', 'inherit', 'inherit'],
        shell: true,
      });

      process.on('SIGTERM', toExit);
      process.on('exit', toExit);
    },
  };
}

function html({ title, meta }) {
  const assetsDirrectory = path.join('src', 'client', 'assets');
  const themes = fs.readdirSync(path.join(assetsDirrectory, 'themes'));
  return {
    name: 'html',
    buildStart(outputOptions, bundle) {
      this.emitFile({
        type: 'asset',
        fileName: 'favicon.ico',
        source: fs.readFileSync(path.join(assetsDirrectory, 'favicon.ico')),
      });
      themes.forEach((theme) => {
        this.emitFile({
          type: 'asset',
          fileName: `assets/themes/${theme}`,
          source: fs
            .readFileSync(path.join(assetsDirrectory, 'themes', theme))
            .toString(),
        });
      });
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'index.html',
        source: `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            ${meta.map((x) => `<meta ${x.property}="${x.value}">`).join('\n')}
            <title>${title}</title>
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Fira+Sans+Condensed&display=swap" rel="stylesheet">
            
            <link href="bundle.css" rel="stylesheet">
            <link href="assets/themes/dark.theme.css" rel="stylesheet" media="(prefers-color-scheme: dark)">
            <link href="assets/themes/light.theme.css" rel="stylesheet" media="(prefers-color-scheme: light)">
            <link rel="shortcut icon" type="image/jpg" href="favicon.ico"/>
          </head>
          <body>
            <script src="bundle.js"></script>
          </body>
        </html>
        `,
      });
    },
  };
}

export default [
  {
    input: 'src/client/main.ts',
    output: {
      sourcemap: true,
      format: 'iife',
      name: 'app',
      file: 'public/bundle.js',
    },
    plugins: [
      css({ exclude: ['**/assets'], output: 'bundle.css' }),
      html({
        title: 'portfolio.shkovegor',
        meta: [
          { property: 'charset', value: 'utf-8' },
          { property: 'color-scheme', value: 'light dark' },
        ],
      }),
      svelte({
        preprocess: sveltePreprocess({ sourceMap: !production }),
        compilerOptions: {
          dev: !production,
        },
      }),
      resolve({
        browser: true,
        dedupe: ['svelte'],
      }),
      commonjs(),
      typescript({
        sourceMap: !production,
        inlineSources: !production,
      }),

      !production && serve(),
      !production &&
        livereload({
          watch: 'public/**',
          delay: 1000,
          https: {
            key: fs.readFileSync('localhost-privkey.pem'),
            cert: fs.readFileSync('localhost-cert.pem'),
          },
        }),
      production && terser(),
    ],
    watch: {
      clearScreen: false,
    },
  },
];
