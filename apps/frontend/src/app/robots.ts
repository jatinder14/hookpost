import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://hookpost.hookstep.in';

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/about',
          '/contact',
          '/mcp',
          '/channels',
          '/channels/',
          '/alternatives',
          '/alternatives/',
          '/for',
          '/for/',
          '/vs/',
          '/compare',
          '/guides',
          '/guides/',
          '/docs/',
          '/auth',
          '/auth/login',
          '/privacy',
          '/terms',
          '/data-deletion',
          '/llms.txt',
          '/llms-full.txt',
          '/.well-known/',
        ],
        disallow: [
          '/api/',
          '/admin/',
          '/settings/',
          '/analytics/',
          '/media/',
          '/launches/',
        ],
      },
      {
        userAgent: [
          'Googlebot',
          'Bingbot',
          'Applebot',
          'Applebot-Extended',
          'DuckDuckBot',
          'Baiduspider',
          'YandexBot',
          'facebookexternalhit',
          'Twitterbot',
          'LinkedInBot',
          'ChatGPT-User',
          'GPTBot',
          'OAI-SearchBot',
          'ClaudeBot',
          // ClaudeBot-User is the separate agent Claude uses when a PERSON asks
          // it to fetch a page, as opposed to ClaudeBot which crawls for
          // training. Allowing only ClaudeBot means someone asking Claude about
          // Hookpost can be refused the page in the moment they are researching
          // it - the exact query we want to be present for.
          'ClaudeBot-User',
          'Claude-Web',
          'anthropic-ai',
          'PerplexityBot',
          'Google-Extended',
          'CCBot',
          'Amazonbot',
          'Bytespider',
          'meta-externalagent',
        ],
        allow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
