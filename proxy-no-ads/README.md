
# Proxy No Ads (Node.js)

Proxy simple para cargar el reproductor de `hlswish.com` quitando scripts e iframes de publicidad antes de enviarlo al usuario.

## Requisitos
- Node.js 18+ y npm

## Instalación
```bash
npm install
```

## Ejecutar en local
```bash
npm start
# Abre: http://localhost:3000/player?id=o2xzjpl0vhsa
```

## Uso en tu web (iframe)
```html
<iframe src="http://TU_HOST:3000/player?id=o2xzjpl0vhsa"
        width="800" height="450" frameborder="0" allowfullscreen></iframe>
```

> Reemplaza `TU_HOST` por `localhost`, tu IP local o el dominio/host donde lo despliegues.

## Despliegue en Render (gratis)
1. Crea un repo en GitHub (por ejemplo `proxy-no-ads`) y sube estos archivos.
2. Ve a https://dashboard.render.com -> **New +** -> **Web Service** -> **Build & deploy from a Git repository**.
3. Conecta tu cuenta de GitHub y selecciona el repo.
4. **Runtime:** Node  
   **Build Command:** `npm install`  
   **Start Command:** `npm start`
5. Espera a que Render te asigne una URL (por ejemplo `https://proxy-no-ads.onrender.com`).
6. En tu web usa:
```html
<iframe src="https://proxy-no-ads.onrender.com/player?id=o2xzjpl0vhsa"
        width="800" height="450" frameborder="0" allowfullscreen></iframe>
```

## Notas
- Este proxy hace un filtrado **básico**. Puede que algunos anuncios entren por otras rutas. Mejora las reglas en `cleanHtml()` según necesites.
- Respeta los términos de uso de los sitios origen.
