import Seo from "../components/Seo";
import PageHero from "../components/PageHero";
import PropertyListing from "../components/PropertyListing";

export default function Lease() {
  return (
    <>
      <Seo
        title="Properties for Lease"
        description="Discover premium rental and lease properties with Wallmark Realtors. Filter by budget, location and property type."
      />
      <PageHero
        eyebrow="Rentals & Leasing"
        title="Lease a Premium Property"
        subtitle="Furnished and unfurnished homes and offices, ready for you to move in."
        breadcrumb="Lease"
        image="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=2000&q=80"
      />
      <PropertyListing listingType="lease" />
    </>
  );
}
