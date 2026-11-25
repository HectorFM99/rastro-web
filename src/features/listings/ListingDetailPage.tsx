import { Link, useParams } from "react-router";
import { useGetListingQuery } from "../../app/api";
import { CATEGORY_LABELS, formatPrice } from "../../app/labels";
import { Loading } from "../../components/ui/Loading";
import { OfferForm } from "../offers/OfferForm";
import { OfferList } from "../offers/OfferList";
import { useCurrentUser } from "../users/CurrentUserContext";
import { SellerPanel } from "./SellerPanel";
import { StatusBadge } from "./StatusBadge";
import styles from "./ListingDetailPage.module.css";

export function ListingDetailPage() {
  const { id } = useParams();
  const { data: listing, isLoading, isError } = useGetListingQuery(id!);
  const { user } = useCurrentUser();

  if (isLoading) {
    return <Loading text="Cargando anuncio..." />;
  }

  if (isError || !listing) {
    return (
      <>
        <p className="error" role="alert">
          Ese anuncio no existe.
        </p>
        <p>
          <Link to="/">← Volver a los anuncios</Link>
        </p>
      </>
    );
  }

  const isSeller = listing.seller.id === user.id;

  return (
    <>
      <p>
        <Link to="/">← Volver a los anuncios</Link>
      </p>

      <div className={styles.layout}>
        <article className={styles.main}>
          <h1>{listing.title}</h1>
          <StatusBadge status={listing.status} />
          <span className={styles.price}>{formatPrice(listing.price)}</span>
          <p>{listing.description}</p>

          <dl className={styles.facts}>
            <div>
              <dt>Categoría</dt>
              <dd>{CATEGORY_LABELS[listing.category]}</dd>
            </div>
            <div>
              <dt>Ciudad</dt>
              <dd>{listing.city}</dd>
            </div>
            <div>
              <dt>Vendedor</dt>
              <dd>{listing.seller.name}</dd>
            </div>
            <div>
              <dt>Visitas</dt>
              <dd>{listing.views}</dd>
            </div>
          </dl>
        </article>

        <aside className={styles.side}>
          {isSeller ? (
            <SellerPanel listing={listing} />
          ) : listing.status === "AVAILABLE" ? (
            <OfferForm listingId={listing.id} />
          ) : (
            <p className="loading">Este anuncio ya no admite ofertas.</p>
          )}
          <OfferList listingId={listing.id} />
        </aside>
      </div>
    </>
  );
}
