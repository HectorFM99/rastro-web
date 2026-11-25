import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateListingMutation } from "../../app/api";
import { getErrorMessage } from "../../app/apiError";
import { CATEGORY_LABELS, CITIES } from "../../app/labels";
import { useCurrentUser } from "../users/CurrentUserContext";

const listingSchema = z.object({
  title: z.string().trim().min(1, "Escribe un título"),
  description: z.string().trim().min(1, "Escribe una descripción"),
  price: z.number("Escribe un precio").min(0, "El precio no puede ser negativo"),
  category: z.string().min(1, "Elige una categoría"),
  city: z.string().trim().min(1, "Elige una ciudad"),
});

type ListingFormValues = z.infer<typeof listingSchema>;

export function NewListingPage() {
  const { user } = useCurrentUser(); // se publica a su nombre
  const navigate = useNavigate();
  const [createListing, { isLoading }] = useCreateListingMutation();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ListingFormValues>({ resolver: zodResolver(listingSchema) });

  async function onSubmit(data: ListingFormValues) {
    setError(null);
    try {
      // El estado, la fecha, las visitas y el nombre del vendedor los pone la API
      const created = await createListing({ ...data, sellerId: user.id, attributes: {} }).unwrap();
      navigate(`/listings/${created.id}`);
    } catch (e) {
      setError(getErrorMessage(e));
    }
  }

  return (
    <>
      <h1>Publicar un anuncio</h1>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}

        <label htmlFor="title">Título</label>
        <input id="title" {...register("title")} />
        {errors.title && <p className="field-error">{errors.title.message}</p>}

        <label htmlFor="description">Descripción</label>
        <textarea id="description" rows={3} {...register("description")} />
        {errors.description && <p className="field-error">{errors.description.message}</p>}

        <label htmlFor="price">Precio (€)</label>
        <input id="price" type="number" {...register("price", { valueAsNumber: true })} />
        {errors.price && <p className="field-error">{errors.price.message}</p>}

        <label htmlFor="category">Categoría</label>
        <select id="category" {...register("category")}>
          <option value="">Elige una</option>
          {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        {errors.category && <p className="field-error">{errors.category.message}</p>}

        <label htmlFor="city">Ciudad</label>
        <select id="city" {...register("city")}>
          <option value="">Elige una</option>
          {CITIES.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
        {errors.city && <p className="field-error">{errors.city.message}</p>}

        <p>
          Se publicará a nombre de <strong>{user.name}</strong>
        </p>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Publicando..." : "Publicar"}
        </button>
      </form>
    </>
  );
}
