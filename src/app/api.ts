import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  FromApi,
  Listing,
  ListingFilters,
  ListingSummary,
  NewListing,
  NewOffer,
  Offer,
} from "./types";

// La API devuelve "_id" (MongoDB). La web usa "id": le cambiamos el nombre al llegar
function withId<T>({ _id, ...rest }: FromApi<T>): T {
  return { ...rest, id: _id } as T;
}

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
  tagTypes: ["Listing", "Offer"],
  endpoints: (builder) => ({
    // GET /listings?category=Cars&city=Valencia&maxPrice=500
    // La API ya los ordena del más nuevo al más viejo
    getListings: builder.query<ListingSummary[], ListingFilters>({
      query: ({ category, city, maxPrice }) => ({
        url: "/listings",
        // params: RTK Query monta el ?category=...&city=... (y se salta los que son undefined)
        params: { category, city, maxPrice },
      }),
      transformResponse: (listings: FromApi<ListingSummary>[]) => listings.map(withId),
      providesTags: ["Listing"],
    }),

    // GET /listings/:id
    getListing: builder.query<Listing, string>({
      query: (id) => `/listings/${id}`,
      transformResponse: (listing: FromApi<Listing>) => withId(listing),
      providesTags: ["Listing"],
    }),

    // GET /listings/:id/offers (la API ya las ordena de la más nueva a la más vieja)
    getOffers: builder.query<Offer[], string>({
      query: (listingId) => `/listings/${listingId}/offers`,
      transformResponse: (offers: FromApi<Offer>[]) => offers.map(withId),
      providesTags: ["Offer"],
    }),

    // POST /offers con { listingId, buyerId, amount }
    createOffer: builder.mutation<Offer, NewOffer>({
      query: (body) => ({ url: "/offers", method: "POST", body }),
      transformResponse: (offer: FromApi<Offer>) => withId(offer),
      invalidatesTags: ["Offer"],
    }),

    // POST /listings con { title, description, price, category, city, sellerId }
    createListing: builder.mutation<Listing, NewListing>({
      query: (body) => ({ url: "/listings", method: "POST", body }),
      transformResponse: (listing: FromApi<Listing>) => withId(listing),
      invalidatesTags: ["Listing"],
    }),

    // PATCH /listings/:id  (solo el precio)
    updatePrice: builder.mutation<Listing, { id: string; price: number }>({
      query: ({ id, price }) => ({ url: `/listings/${id}`, method: "PATCH", body: { price } }),
      transformResponse: (listing: FromApi<Listing>) => withId(listing),
      invalidatesTags: ["Listing"],
    }),

    // DELETE /listings/:id. No usamos lo que devuelve: void
    deleteListing: builder.mutation<void, string>({
      query: (id) => ({ url: `/listings/${id}`, method: "DELETE" }),
      invalidatesTags: ["Listing"],
    }),
  }),
});

export const {
  useGetListingsQuery,
  useGetListingQuery,
  useGetOffersQuery,
  useCreateOfferMutation,
  useCreateListingMutation,
  useUpdatePriceMutation,
  useDeleteListingMutation,
} = api;
