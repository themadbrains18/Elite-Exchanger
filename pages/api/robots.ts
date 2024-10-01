// pages/api/robots.ts

export default function handler(req: any, res: any) {
    const siteName = process.env.NEXT_PUBLIC_APP_HOSTNAME || 'Default Site Name';

    res.setHeader('Content-Type', 'text/plain');
    res.write(`
      User-agent: *
      Allow: /
        Disallow: /admin/
    Disallow: /private/
      Sitemap: https://${siteName}/sitemap.xml
    `);
    res.end();
}
