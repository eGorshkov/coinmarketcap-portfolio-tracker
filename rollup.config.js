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
import { cyan } from 'kleur';

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
  const themeDirrectory = path.join('src', 'client', 'assets');
  const themes = fs.readdirSync(themeDirrectory);
  return {
    name: 'html',
    buildStart(outputOptions, bundle) {
      themes.forEach((theme) => {
        this.emitFile({
          type: 'asset',
          fileName: theme,
          source: fs.readFileSync(path.join(themeDirrectory, theme)).toString(),
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
            <link href="bundle.css" rel="stylesheet">
            <link href="dark.theme.css" rel="stylesheet" media="(prefers-color-scheme: dark)">
            <link href="light.theme.css" rel="stylesheet" media="(prefers-color-scheme: light)">
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

export default {
  input: 'src/client/main.ts',
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'app',
    file: 'public/bundle.js',
  },
  plugins: [
    svelte({
      preprocess: sveltePreprocess({ sourceMap: !production }),
      compilerOptions: {
        dev: !production,
      },
    }),
    css({ exclude: ['**/assets'], output: 'bundle.css' }),
    html({
      title: 'SSE',
      meta: [
        { property: 'charset', value: 'utf-8' },
        { property: 'color-scheme', value: 'light dark' },
      ],
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
    exclude: 'node_modules/**',
    include: 'src/**',
    clearScreen: false,
  },
};
