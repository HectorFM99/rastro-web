// Cómo usa la web los datos de la API de Rastro (Express + MongoDB)

export type ListingStatus = "AVAILABLE" | "RESERVED" | "SOLD";
export type OfferStatus = "PENDING" | "ACCEPTED" | "REJECTED";

// Lo que usa el listado (GET /listings)
export type ListingSummary = {
  id: string;
  title: string;
  price: number;
  category: string;
  city: string;
  status: ListingStatus;
};

// La ficha completa (GET /listings/:id): lo de arriba y más
export type Listing = ListingSummary & {
  description: string;
  publishedAt: string;
  views: number;
  seller: { id: string; name: string };
  attributes: Record<string, string | number>;
};

// Un anuncio nuevo: lo que espera POST /api/listings.
// El estado, la fecha, las visitas y el nombre del vendedor los pone la API
export type NewListing = {
  title: string;
  description: string;
  price: number;
  category: string;
  city: string;
  sellerId: string;
  attributes?: Record<string, string | number>;
};

export type Offer = {
  id: string;
  amount: number;
  status: OfferStatus;
  createdAt: string;
  listing: { id: string; title: string; price: number };
  buyer: { id: string; name: string };
};

// Una oferta nueva: lo que espera POST /api/offers.
// El estado, la fecha y el nombre del comprador los pone la API
export type NewOffer = {
  listingId: string;
  buyerId: string;
  amount: number;
};

// MongoDB llama al id "_id": así llega de la API antes de cambiarle el nombre
export type FromApi<T> = Omit<T, "id"> & { _id: string };

// Los filtros del listado. Todos opcionales
export type ListingFilters = {
  category?: string;
  city?: string;
  maxPrice?: string;
};
