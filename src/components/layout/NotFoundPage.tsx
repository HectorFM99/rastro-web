import { Link } from "react-router";

export function NotFoundPage() {
  return (
    <>
      <h1>Página no encontrada</h1>
      <p>La dirección que buscas no existe.</p>
      <p>
        <Link to="/">Volver a los anuncios</Link>
      </p>
    </>
  );
}
