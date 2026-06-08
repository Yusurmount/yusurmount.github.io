import { defineConfig } from 'astro/config'
import { remarkReadingTime } from './src/plugins/remarkReadingTime'
import { rehypeCodeBlock } from './src/plugins/rehypeCodeBlock'
import { rehypeTableBlock } from './src/plugins/rehypeTableBlock'
import { rehypeCodeHighlight } from './src/plugins/rehypeCodeHighlight'
import { rehypeImage } from './src/plugins/rehypeImage'
import { rehypeLink } from './src/plugins/rehypeLink'
import { rehypeHeading } from './src/plugins/rehypeHeading'
import remarkDirective from 'remark-directive'
import { remarkSpoiler } from './src/plugins/remarkSpoiler'
import { remarkEmbed } from './src/plugins/remarkEmbed'
import tailwind from '@astrojs/tailwind'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import { rehypeHeadingIds } from '@astrojs/markdown-remark'
import { site } from './src/config.json'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import swup from '@swup/astro'

// https://astro.build/config
export default defineConfig({
  site: site.url,
  integrations: [
    tailwind(),
    react(),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      filter: (page) => {
        return !page.includes('404') && !page.includes('/page/')
      },
      serialize: (item) => {
        const pathname = new URL(item.url).pathname
        const priorityMap = {
          '/': 1.0,
          '/about/': 0.9,
          '/projects/': 0.9,
          '/projects/Leaf-OS/': 1.0,
          '/projects/Leaf-OS/download/': 0.8,
          '/docs/': 0.8,
          '/archives/': 0.8,
          '/tags/': 0.6,
          '/categories/': 0.6,
        }

        const changefreqMap = {
          '/': 'daily',
          '/about/': 'monthly',
          '/projects/': 'weekly',
          '/projects/Leaf-OS/': 'weekly',
          '/projects/Leaf-OS/download/': 'weekly',
          '/docs/': 'weekly',
          '/archives/': 'daily',
          '/tags/': 'monthly',
          '/categories/': 'monthly',
        }

        const getPriority = (path) => {
          if (priorityMap[path]) return priorityMap[path]
          if (path.startsWith('/posts/')) return 0.7
          if (path.startsWith('/docs/')) return 0.7
          if (path.startsWith('/tags/')) return 0.5
          if (path.startsWith('/categories/')) return 0.5
          if (path.startsWith('/docs-categories/')) return 0.5
          return 0.7
        }

        const getChangefreq = (path) => {
          if (changefreqMap[path]) return changefreqMap[path]
          if (path.startsWith('/posts/')) return 'weekly'
          return 'weekly'
        }

        return {
          ...item,
          priority: getPriority(pathname),
          changefreq: getChangefreq(pathname),
          lastmod: new Date(),
        }
      },
    }),
    swup({
      theme: false,
      animationClass: 'swup-transition-',
      containers: ['main'],
      morph: ['[component-export="Provider"]'],
    }),
  ],
  markdown: {
    syntaxHighlight: false,
    smartypants: false,
    remarkPlugins: [remarkMath, remarkDirective, remarkEmbed, remarkSpoiler, remarkReadingTime],
    rehypePlugins: [
      rehypeHeadingIds,
      rehypeKatex,
      rehypeLink,
      rehypeImage,
      rehypeHeading,
      rehypeCodeBlock,
      rehypeCodeHighlight,
      rehypeTableBlock,
    ],
    remarkRehype: { footnoteLabel: '参考', footnoteBackLabel: '返回正文' },
  },
  vite: {
    build: {
      rollupOptions: {
        external: ['/pagefind/pagefind.js'],
      },
    },
  },
})
