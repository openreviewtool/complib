import typescript from 'rollup-plugin-typescript2';
import scss from 'rollup-plugin-scss';
import pkg from './package.json';
import del from 'rollup-plugin-delete'

export default [
  {
    input: 'src/index.ts',
    output: [
      { file: pkg.main, format: 'cjs'},
      { file: pkg.module, format: 'esm' },
    ],
    plugins: [
      del({ targets: 'dist/*' }),
      typescript(),
      scss({output: 'dist/style.css'}),
    ],
    external: Object.keys(pkg.peerDependencies || {})
  },
];