import createMDX from '@next/mdx';

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'mdx'],
  // Native driver: keep it out of the bundler and load it at runtime on the server.
  serverExternalPackages: ['@libsql/client'],
  experimental: {
    // MDX notes live in /content and are imported by topic pages.
    mdxRs: false,
  },
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    // Turbopack requires plugins be referenced by name (serializable config).
    remarkPlugins: [['remark-gfm', {}]],
    rehypePlugins: [
      ['rehype-slug', {}],
      [
        '@shikijs/rehype',
        {
          themes: { light: 'github-light', dark: 'github-dark-default' },
          defaultColor: false,
          cssVariablePrefix: '--shiki-',
        },
      ],
    ],
  },
});

export default withMDX(nextConfig);
