import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const isDevelopment = process.env.NODE_ENV === 'development';

export default /** @type {import('rollup').RollupOptions} */ ({
    input: 'extension.js',
    output: {
        file: pkg.main,
        format: 'cjs',
        exports: 'named',
        sourcemap: isDevelopment,
    },
    external: ['vscode'],
    plugins: [
        nodeResolve(),
        commonjs({ ignore: (id) => /package.json/.test(id) }),
        terser({ mangle: !isDevelopment }),
    ],
});
