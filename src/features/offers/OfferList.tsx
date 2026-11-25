import { useGetOffersQuery } from "../../app/api";
import { formatPrice } from "../../app/labels";
import { Loading } from "../../components/ui/Loading";
import { StatusBadge } from "../listings/StatusBadge";
import styles from "./OfferList.module.css";

type OfferListProps = {
  listingId: string;
};

// Pide sus propios datos: las ofertas del anuncio
export function OfferList({ listingId }: OfferListProps) {
  const { data: offers, isLoading, isError } = useGetOffersQuery(listingId);

  return (
    <div className={styles.box}>
      <h2>Ofertas ({offers?.length ?? 0})</h2>

      {isLoading && <Loading text="Cargando ofertas..." />}

      {isError && (
        <p className="error" role="alert">
          No se han podido cargar las ofertas.
        </p>
      )}

      {offers && offers.length === 0 && <p className="loading">Todavía no hay ofertas.</p>}

      {offers?.map((offer) => (
        <div key={offer.id} className={styles.offer}>
          <span>{offer.buyer.name}</span>
          <strong>{formatPrice(offer.amount)}</strong>
          <StatusBadge status={offer.status} />
        </div>
      ))}
    </div>
  );
}
