import type { MDXComponents } from 'mdx/types';

/**
 * Component overrides for MDX notes. Styling lives in the `.note` CSS block in
 * globals.css, so this only needs to handle structural concerns.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // External links in notes always open in a new tab.
    a: ({ href, children, ...props }) => {
      const external = typeof href === 'string' && /^https?:\/\//.test(href);
      return (
        <a
          href={href}
          {...(external
            ? { target: '_blank', rel: 'noreferrer noopener' }
            : {})}
          {...props}
        >
          {children}
        </a>
      );
    },
    ...components,
  };
}
