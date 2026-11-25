# Respuestas — Rastro

## Pregunta 1 (Parte 2)

**¿Por qué `changeFilter` hace una copia con `new URLSearchParams(searchParams)` en vez de cambiar `searchParams` directamente?**

Porque `searchParams` es estado de React (sale de `useSearchParams`) y el estado no se cambia: se crea uno nuevo. Si cambiara `searchParams` directamente, React no se enteraría de que algo ha cambiado (sigue siendo el mismo objeto) y no volvería a pintar la página. Con la copia (`next`) añado o quito el filtro sin tocar el original y después `setSearchParams(next)` cambia la URL y avisa a React para que vuelva a pintar con los filtros nuevos.
