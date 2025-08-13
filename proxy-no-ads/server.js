// server.js
// Proxy anti-anuncios para reproducir iframes de hlswish "limpios"
// Ejecuta: npm install && npm start

const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const compression = require("compression");
const helmet = require("helmet");

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(compression());
app.use(helmet({
  contentSecurityPolicy: false,
}));

// Healthcheck
app.get("/health", (req, res) => res.json({ ok: true }));

// Página informativa
app.get("/", (req, res) => {
  res.type("html").send(`
    <html>
      <head><meta charset="utf-8"><title>Proxy No Ads</title></head>
      <body style="font-family: sans-serif; max-width: 680px; margin: 40px auto;">
        <h1>Proxy No Ads (Node.js)</h1>
        <p>Usa <code>/player?id=CODIGO</code> para cargar un embed limpio.</p>
        <p>Ejemplo: <a href="/player?id=o2xzjpl0vhsa">/player?id=o2xzjpl0vhsa</a></p>
      </body>
    </html>
  `);
});

// Utilidad de filtrado básico de anuncios
function cleanHtml(html) {
  const $ = cheerio.load(html);

  // 1) Eliminar scripts sospechosos
  $("script").each((_, el) => {
    const src = $(el).attr("src") || "";
    const code = ($(el).html() || "").toLowerCase();
    const looksAd =
      src.includes("ads") ||
      src.includes("pop") ||
      src.includes("push") ||
      src.includes("analytics") ||
      code.includes("ads") ||
      code.includes("popunder") ||
      code.includes("notification") ||
      code.includes("banner");
    if (looksAd) $(el).remove();
  });

  // 2) Eliminar iframes externos sospechosos
  $("iframe").each((_, el) => {
    const src = ($(el).attr("src") || "").toLowerCase();
    if (src.includes("ads") || src.includes("doubleclick") || src.includes("pop")) {
      $(el).remove();
    }
  });

  // 3) Eliminar enlaces a dominios de ads comunes
  $("a, link").each((_, el) => {
    const href = ($(el).attr("href") || "").toLowerCase();
    if (href.includes("ads") || href.includes("doubleclick")) $(el).remove();
  });

  // 4) Quitar onclick/handlers sospechosos
  const attrsToStrip = ["onclick", "onload", "onmouseover", "onmouseenter"];
  $("*").each((_, el) => {
    attrsToStrip.forEach(a => {
      const val = $(el).attr(a);
      if (val && (val.toLowerCase().includes("ad") || val.toLowerCase().includes("pop"))) {
        $(el).removeAttr(a);
      }
    });
  });

  return $.html();
}

// Ruta principal del proxy
app.get("/player", async (req, res) => {
  const id = (req.query.id || "").trim();
  if (!id) return res.status(400).send("Falta el parámetro ?id=");

  const target = `https://hlswish.com/e/${encodeURIComponent(id)}`;

  try {
    const { data: html } = await axios.get(target, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept-Language": "es-ES,es;q=0.9,en;q=0.8",
      },
      timeout: 15000,
    });

    const cleaned = cleanHtml(html);

    // Permitir ser embebido en iframes
    res.removeHeader("X-Frame-Options");
    res.setHeader("Content-Security-Policy", "frame-ancestors *");
    res.setHeader("Access-Control-Allow-Origin", "*");

    res.type("html").send(cleaned);
  } catch (err) {
    console.error(err.message);
    res
      .status(502)
      .send("No se pudo obtener el contenido remoto: " + (err.response?.status || err.message));
  }
});

app.listen(PORT, () => {
  console.log(`Proxy No Ads escuchando en http://localhost:${PORT}`);
});
