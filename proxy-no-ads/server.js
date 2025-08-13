const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();
const PORT = process.env.PORT || 3000;

// Ruta para el reproductor
app.get('/player', async (req, res) => {
  const videoId = req.query.id;
  const url = req.query.url; // También aceptará URL directa

  if (!videoId && !url) {
    return res.status(400).send('Falta parámetro id o url');
  }

  try {
    let targetUrl = url || `https://hlswish.com/e/${videoId}`;
    const response = await axios.get(targetUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    // Usar cheerio para manipular HTML y quitar anuncios
    const $ = cheerio.load(response.data);

    // Eliminar scripts e iframes publicitarios
    $('script').remove();
    $('iframe').remove();
    $('[onclick]').removeAttr('onclick');
    $('[onmouseover]').removeAttr('onmouseover');

    res.send($.html());
  } catch (err) {
    res.status(500).send('Error al cargar el video: ' + err.message);
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
