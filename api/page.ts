export const config = { runtime: 'edge' };

const BOT_UA = /facebookexternalhit|Twitterbot|WhatsApp|TelegramBot|LinkedInBot|Slackbot|Discordbot|ia_archiver|Googlebot|bingbot/i;

function formatCuit(cuit: string): string {
  return `${cuit.slice(0, 2)}-${cuit.slice(2, 10)}-${cuit.slice(10)}`;
}

export default async function handler(req: Request) {
  const url = new URL(req.url);
  const cuit = url.searchParams.get('cuit')?.replace(/-/g, '') ?? '';
  const ua = req.headers.get('user-agent') ?? '';

  // For browsers, serve the normal SPA index.html
  if (!BOT_UA.test(ua)) {
    const origin = url.origin;
    return fetch(`${origin}/index.html`);
  }

  // For bots, serve dynamic OG meta tags
  const origin = url.origin;
  const ogImage = `${origin}/api/og?cuit=${cuit}`;
  const title = `Deudas de CUIT ${formatCuit(cuit)} — deudas.ar`;
  const description = `Consulta el historial de deudas del CUIT ${formatCuit(cuit)} en la Central de Deudores del BCRA.`;
  const pageUrl = `${origin}/?cuit=${cuit}`;

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <title>${title}</title>
  <meta property="og:type" content="website"/>
  <meta property="og:title" content="${title}"/>
  <meta property="og:description" content="${description}"/>
  <meta property="og:image" content="${ogImage}"/>
  <meta property="og:image:width" content="1200"/>
  <meta property="og:image:height" content="630"/>
  <meta property="og:url" content="${pageUrl}"/>
  <meta name="twitter:card" content="summary_large_image"/>
  <meta name="twitter:title" content="${title}"/>
  <meta name="twitter:description" content="${description}"/>
  <meta name="twitter:image" content="${ogImage}"/>
</head>
<body></body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
