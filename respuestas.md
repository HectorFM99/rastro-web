# Respuestas — Rastro

## Pregunta 1 (Parte 2)

**¿Por qué `changeFilter` hace una copia con `new URLSearchParams(searchParams)` en vez de cambiar `searchParams` directamente?**

Porque `searchParams` es estado de React (sale de `useSearchParams`) y el estado no se cambia: se crea uno nuevo. Si cambiara `searchParams` directamente, React no se enteraría de que algo ha cambiado (sigue siendo el mismo objeto) y no volvería a pintar la página. Con la copia (`next`) añado o quito el filtro sin tocar el original y después `setSearchParams(next)` cambia la URL y avisa a React para que vuelva a pintar con los filtros nuevos.

## Pregunta 2 (Parte 4)

**`OfferForm` y `OfferList` son hermanos y no se pasan nada. ¿Cómo se entera la lista de que hay una oferta nueva?**

Por la caché de RTK Query y sus tags. `getOffers` dice que da datos con el tag `"Offer"` (`providesTags`) y `createOffer` dice que, cuando termina, ese tag ya no vale (`invalidatesTags: ["Offer"]`). Cuando `OfferForm` crea la oferta, RTK Query marca como caducadas las ofertas guardadas y, como `OfferList` está usando `useGetOffersQuery`, las vuelve a pedir solo. La lista se pinta otra vez con la oferta nueva sin que los dos componentes se hablen.
