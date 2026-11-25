import { useGetListingsQuery } from "../../app/api";
import { Loading } from "../../components/ui/Loading";
import { ListingCard } from "./ListingCard";

export function ListingsPage() {
  const { data: listings, isLoading, isError } = useGetListingsQuery({});

  return (
    <>
      <h1>Anuncios</h1>

      {isLoading && <Loading text="Cargando anuncios..." />}

      {isError && (
        <p className="error" role="alert">
          No se han podido cargar los anuncios.
        </p>
      )}

      {listings && (
        <div className="grid">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </>
  );
}
