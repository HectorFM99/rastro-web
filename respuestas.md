# Respuestas — Rastro

## Pregunta 1 (Parte 2)

**¿Por qué `changeFilter` hace una copia con `new URLSearchParams(searchParams)` en vez de cambiar `searchParams` directamente?**

Porque `searchParams` es estado de React (sale de `useSearchParams`) y el estado no se cambia: se crea uno nuevo. Si cambiara `searchParams` directamente, React no se enteraría de que algo ha cambiado (sigue siendo el mismo objeto) y no volvería a pintar la página. Con la copia (`next`) añado o quito el filtro sin tocar el original y después `setSearchParams(next)` cambia la URL y avisa a React para que vuelva a pintar con los filtros nuevos.

## Pregunta 2 (Parte 4)

**`OfferForm` y `OfferList` son hermanos y no se pasan nada. ¿Cómo se entera la lista de que hay una oferta nueva?**

Por la caché de RTK Query y sus tags. `getOffers` dice que da datos con el tag `"Offer"` (`providesTags`) y `createOffer` dice que, cuando termina, ese tag ya no vale (`invalidatesTags: ["Offer"]`). Cuando `OfferForm` crea la oferta, RTK Query marca como caducadas las ofertas guardadas y, como `OfferList` está usando `useGetOffersQuery`, las vuelve a pedir solo. La lista se pinta otra vez con la oferta nueva sin que los dos componentes se hablen.

## Pregunta 3 (Parte 5)

**¿Qué cambia en la ficha? La ficha no recibe el usuario por props: ¿cómo se entera de que ha cambiado? ¿Se vuelve a pedir el anuncio a la API?**

Cambia la columna de la derecha: con Luis Martín (el vendedor del Seat) sale el panel "Tu anuncio" para cambiar el precio o borrarlo; con Ana García sale el formulario "Hacer una oferta". El resto de la ficha es igual.

La ficha se entera porque lee el usuario con `useCurrentUser()`, que usa `useContext`. Cuando el desplegable llama a `changeUser`, cambia el estado de `CurrentUserProvider` y el `value` del contexto, y React vuelve a pintar todos los componentes que leen ese contexto, la ficha incluida, sin pasar nada por props.

No se vuelve a pedir el anuncio: en la pestaña Red no sale ninguna petición nueva a `/listings/:id`. El anuncio ya está en la caché de RTK Query y lo único que ha cambiado es el usuario, que no está en la API.

## Pregunta 4 (Parte 6)

**¿Por qué hacen falta `PATCH` y `DELETE` en la lista y `Content-Type` en las cabeceras? ¿Qué petición de tu web fallaría sin cada uno?**

Porque la web (en `localhost:5173` o en Netlify) y la API (en `localhost:3000` o en Render) tienen orígenes distintos. Antes de un `PATCH`, un `DELETE` o un `POST` con JSON, el navegador manda una petición `OPTIONS` para preguntar si puede, y solo hace la de verdad si la API contesta que ese método y esas cabeceras están permitidos.

- Sin `PATCH`: falla cambiar el precio en `SellerPanel` (`PATCH /listings/:id`).
- Sin `DELETE`: falla el botón "Borrar anuncio" (`DELETE /listings/:id`).
- Sin `Content-Type`: fallan ofertar (`POST /offers`) y publicar (`POST /listings`), porque RTK Query manda el cuerpo con `Content-Type: application/json` y esa cabecera no es de las que el navegador deja pasar sin preguntar.

## Pregunta 5 (Parte 6)

**Con tu API, entra en el Seat Ibiza y apunta las visitas. Vuelve al listado y entra otra vez. Ahora recarga. ¿Por qué al volver a la ficha no suben y al recargar sí?**

Al volver a la ficha, RTK Query ya tiene ese anuncio en su caché (lo guarda 60 segundos después de dejar de usarlo) y lo pinta sin pedirlo otra vez: no hay `GET /listings/:id`, así que la API no suma la visita. Al recargar, la página arranca de cero, la caché de Redux está vacía y la web vuelve a pedir el anuncio. Esa petición sí llega a la API, que suma una visita con `$inc: { views: 1 }` y devuelve el número nuevo.

## Diario de errores (Parte 6)

| Qué vi (síntoma y código) | Causa | Cómo lo arreglé (fichero) | Qué le pregunté a la IA |
|---|---|---|---|
| Al pulsar un anuncio: "Ese anuncio no existe.", `GET /listings/undefined` con `400` y aviso de la `key` en la consola | Mi API devuelve el id como `_id` (MongoDB) y la web usaba `listing.id` | `transformResponse` en cada endpoint para cambiar `_id` por `id` (`src/app/api.ts`, tipo `FromApi` en `src/app/types.ts`) | Con Claude Code: comparar lo que devuelve mi API con lo que espera la web |
| Móviles hasta 200 € también enseñaba el iPhone (380 €) | El filtro de precio en mi API se llama `maxPrice`, no `price:lte` (eso era de json-server) | `params: { category, city, maxPrice }` en `getListings` y quité `_sort`, porque la API ya ordena (`src/app/api.ts`) | Con Claude Code: comparar la petición con `routes/listings.ts` |
| Ficha del Seat: "Ofertas (0)" y `404 No existe la ruta GET /api/offers?listingId=...` | Mi API no tiene `GET /offers`: las ofertas de un anuncio están en `GET /listings/:id/offers` | `getOffers` pide `/listings/${listingId}/offers` y el tipo `Offer` usa `listing` en vez de `listingId` (`src/app/api.ts`, `src/app/types.ts`) | Con Claude Code: qué ruta da las ofertas en `routes/listings.ts` |
| Ofertar: `buyerId no tiene un formato válido` (`400`) | Mi `POST /offers` espera `{ listingId, buyerId, amount }`; el estado, la fecha y el nombre del comprador los pone la API | `OfferForm` manda `{ listingId, buyerId: user.id, amount }` y cambié `NewOffer` (`src/features/offers/OfferForm.tsx`, `src/app/types.ts`) | Con Claude Code: qué campos valida `POST /offers` en `routes/offers.ts` |
| Publicar: `sellerId no tiene un formato válido` (`400`) | Mi `POST /listings` espera `sellerId` y pone él el estado, la fecha, las visitas y el vendedor | `NewListingPage` manda `{ ...data, sellerId: user.id, attributes: {} }` y cambié `NewListing` (`src/features/listings/NewListingPage.tsx`, `src/app/types.ts`) | Con Claude Code: qué campos valida `POST /listings` en `routes/listings.ts` |
| Ficha del Seat en Render: "Ofertas (0)" aunque en los datos tiene 2 | Los datos de Atlas tienen el formato de `db.json` (`listingId: "listing-1"`, `id: "listing-1"`), no el del apartado 1.1 de Express (`listing.id` con `ObjectId`) | Pendiente: volver a cargar en Atlas los datos del apartado 1.1 de la entrega de Express | Con Claude Code: probar `GET /api/listings/:id/offers` en Render |
