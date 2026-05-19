/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.vriddhivastra.com',
  generateRobotsTxt: true, // (optional)
  exclude: ['/admin', '/admin/*', '/api/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/*', '/api/*'],
      },
    ],
  },
  transform: async (config, path) => {
    let priority = config.priority;
    if (path === '/') priority = 1.0;
    else if (path === '/collections' || path === '/tags') priority = 0.8;
    else if (path.startsWith('/product/')) priority = 0.9;
    else if (path.startsWith('/category/')) priority = 0.8;
    else priority = 0.6;

    return {
      loc: path,
      changefreq: config.changefreq,
      priority: priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    }
  },
}
