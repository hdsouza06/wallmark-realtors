import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import PropertyCard from "./PropertyCard";
import PropertyFilters from "./PropertyFilters";
import Pagination from "./Pagination";
import { PropertyGridSkeleton } from "./Skeletons";
import { propertiesApi } from "../services/api";

export default function PropertyListing({ listingType, showListingType = false }) {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    q: searchParams.get("q") || "",
    location: "",
    property_type: "",
    bhk: "",
    max_price: "",
    sort: "newest",
    page: 1,
  });
  const [data, setData] = useState(null);

  const fetchData = useCallback(() => {
    setData(null);
    const params = { ...filters, page_size: 9 };
    if (listingType) params.listing_type = listingType;
    Object.keys(params).forEach((k) => params[k] === "" && delete params[k]);
    propertiesApi.list(params).then(setData).catch(() => setData({ items: [], pages: 0 }));
  }, [filters, listingType]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <section className="container-luxe py-14 lg:py-20">
      <PropertyFilters
        filters={filters}
        onChange={setFilters}
        onSubmit={fetchData}
        showListingType={showListingType}
      />

      <div className="mt-10">
        {data === null ? (
          <PropertyGridSkeleton count={9} />
        ) : data.items.length ? (
          <>
            <p className="mb-6 text-sm text-gray-500">
              Showing <span className="font-semibold text-navy-900">{data.total}</span> properties
            </p>
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {data.items.map((p, i) => (
                <PropertyCard key={p.id} property={p} index={i} />
              ))}
            </div>
            <Pagination
              page={data.page}
              pages={data.pages}
              onPage={(page) => setFilters((f) => ({ ...f, page }))}
            />
          </>
        ) : (
          <div className="rounded-2xl bg-cream py-20 text-center">
            <p className="text-lg font-semibold text-navy-900">No properties found</p>
            <p className="mt-2 text-sm text-gray-500">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>
    </section>
  );
}
