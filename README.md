# Proxy No Ads (Node.js)

Proxy para cargar reproductores de video quitando scripts e iframes de publicidad antes de enviarlo al usuario.

## Instalación local
```bash
npm install
npm start
# Abre: http://localhost:3000/player?id=VIDEO_ID
# O:    http://localhost:3000/player?url=URL_COMPLETA
```

## Uso en tu web
```html
<iframe src="https://TU_DOMINIO.onrender.com/player?id=VIDEO_ID"
        width="800" height="450" frameborder="0" allowfullscreen></iframe>
```

También puedes pasar URL directa:
```html
<iframe src="https://TU_DOMINIO.onrender.com/player?url=https://ejemplo.com/video"
        width="800" height="450" frameborder="0" allowfullscreen></iframe>
```
