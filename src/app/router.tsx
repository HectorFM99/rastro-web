import { createBrowserRouter } from "react-router";
import { Layout } from "../components/layout/Layout";
import { NotFoundPage } from "../components/layout/NotFoundPage";
import { ListingDetailPage } from "../features/listings/ListingDetailPage";
import { ListingsPage } from "../features/listings/ListingsPage";
import { NewListingPage } from "../features/listings/NewListingPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <ListingsPage /> },
      // listings/new va antes que listings/:id: si no, "new" se tomaría por un id
      { path: "listings/new", element: <NewListingPage /> },
      { path: "listings/:id", element: <ListingDetailPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
