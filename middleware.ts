const BOT_UA = /facebookexternalhit|Twitterbot|WhatsApp|TelegramBot|LinkedInBot|Slackbot|Discordbot|ia_archiver/i;

function formatCuit(cuit: string): string {
  return `${cuit.slice(0, 2)}-${cuit.slice(2, 10)}-${cuit.slice(10)}`;
}

export default function middleware(req: Request) {
  const url = new URL(req.url);
  const cuit = url.searchParams.get('cuit')?.replace(/-/g, '');
  const ua = req.headers.get('user-agent') ?? '';

  if (!cuit || !/^\d{11}$/.test(cuit) || !BOT_UA.test(ua)) {
    return;
  }

  const origin = url.origin;
  const ogImage = `${origin}/api/og?cuit=${cuit}`;
  const title = `Deudas de CUIT ${formatCuit(cuit)} — deudas.ar`;
  const description = `Consulta el historial de deudas del CUIT ${formatCuit(cuit)} en la Central de Deudores del BCRA.`;

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
  <meta property="og:url" content="${origin}/?cuit=${cuit}"/>
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

export const config = {
  matcher: '/',
};
