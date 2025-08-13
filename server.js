const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
const PORT = process.env.PORT || 3000;

// Página de prueba para verificar que el servidor está activo
app.get("/", (req, res) => {
  res.send("<h2>Proxy No Ads activo ✅</h2><p>Usa /player?id=VIDEO_ID o /player?url=URL_COMPLETA</p>");
});

app.get("/player", async (req, res) => {
  const videoId = req.query.id;
  const videoUrl = req.query.url;

  if (!videoId && !videoUrl) {
    return res.status(400).send("Debes indicar ?id= o ?url=");
  }

  const target = videoUrl || `https://hlswish.com/e/${videoId}`;

  try {
    const response = await axios.get(target, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    const $ = cheerio.load(response.data);

    // === Limpieza brava ===
    $("script, iframe").remove();
    $("div").each((i, el) => {
      const html = $(el).html() || "";
      if (/adblock|blockad|overlay|popup/i.test(html)) $(el).remove();
    });
    $("[onclick], [onmouseover]").removeAttr("onclick").removeAttr("onmouseover");
    $("[style]").each((i, el) => {
      const style = $(el).attr("style") || "";
      if (/position\s*:\s*fixed/i.test(style)) $(el).remove();
    });

    res.removeHeader("X-Frame-Options");
    res.set("Content-Security-Policy", "frame-ancestors *");
    res.send($.html());

  } catch (err) {
    console.error("Error cargando target:", err.message);
    if (err.response && err.response.status === 404) {
      return res.status(404).send("Video no encontrado en el servidor original");
    }
    res.status(502).send("Error al cargar contenido remoto");
  }
});

app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
