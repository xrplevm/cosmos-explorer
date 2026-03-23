import { next } from '@cosmos-explorer/eslint-config/next';

export default [
  { ignores: ['.next/**', 'next.config.ts'] },
  ...next,
];
