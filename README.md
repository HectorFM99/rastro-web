# Rastro (web)

La web de **Rastro**, la app de compraventa de segunda mano, hecha con React + TypeScript + Vite, Redux Toolkit (RTK Query), React Router, React Hook Form y Zod.

- **Web publicada (Netlify):** https://rastro-tunombre.netlify.app (pendiente: tu dirección de Netlify)
- **API (Render):** https://api-rastro.onrender.com/api

## Cómo arrancarla

### Con tu API (Express + MongoDB)

```bash
npm install
cp .env.example .env   # VITE_API_URL=http://localhost:3000/api (o la de Render)
npm run dev            # la web en http://localhost:5173
```

### Con json-server (primera parte, etiqueta `v1-json-server`)

```bash
git checkout v1-json-server
npm install
npm run api   # json-server en http://localhost:3001
npm run dev   # la web en http://localhost:5173 (VITE_API_URL=http://localhost:3001)
```

Si `db.json` se llena de pruebas, cópiale encima `db.initial.json`.

## Páginas

| Ruta | Página |
|---|---|
| `/` | Anuncios, con filtros de categoría, ciudad y precio máximo en la URL |
| `/listings/:id` | Ficha del anuncio y sus ofertas. Si no eres el vendedor, el formulario para ofertar |
| `/listings/:id` (vendedor) | Cambiar el precio o borrar el anuncio |
| `/listings/new` | Publicar un anuncio |
| cualquier otra | Página no encontrada |

## Capturas

Pendiente: hacer las capturas y guardarlas en `docs/`.

| Listado con filtros | Ficha como comprador |
|---|---|
| ![Listado con filtros](docs/01_listado.png) | ![Ficha como comprador](docs/02_ficha_comprador.png) |

| Ficha como vendedor | Publicar |
|---|---|
| ![Ficha como vendedor](docs/03_ficha_vendedor.png) | ![Publicar](docs/04_publicar.png) |
