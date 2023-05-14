import { type Plugin, defineConfig } from 'vite';
import mdx from '@mdx-js/rollup';
import pckg from './package.json' assert { type: 'json' };
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import solid from 'vite-plugin-solid';

export default defineConfig({
  define: {
    __UPDATED_AT__: JSON.stringify(new Date().toLocaleString()),
    __SOLID_VERSION__: JSON.stringify(pckg.dependencies['solid-js']),
  },
  plugins: [
    {
      ...mdx({
        jsx: true,
        jsxImportSource: 'solid-js',
        providerImportSource: 'solid-mdx',
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeHighlight],
      }),
      enforce: 'pre',
    } as Plugin,
    solid({ extensions: ['.md', '.mdx'] }),
    // VitePWA(pwaOptions),
  ],
  optimizeDeps: {
    include: [],
    exclude: ['@solid.js/docs'],
  },
  build: {
    target: 'esnext',
  },
});
