// import Ts from "rollup-plugin-typescript2";

// export default {
//   input: ["src/index.ts"],
//   output: {
//     dir: "lib",
//     format: "esm",
//     sourcemap: true,
//   },
//   plugins: [Ts()],
//   external: ["react"],
// };

import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';

export default [
  {
    input: 'src/index.ts',
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'esm' },
    ],
    plugins: [
      typescript(),
    ],
    external: Object.keys(pkg.peerDependencies || {})
  },
];