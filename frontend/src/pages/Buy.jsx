import Seo from "../components/Seo";
import PageHero from "../components/PageHero";
import PropertyListing from "../components/PropertyListing";

export default function Buy() {
  return (
    <>
      <Seo
        title="Properties for Sale"
        description="Browse premium properties for sale with Wallmark Realtors — apartments, villas, and commercial spaces in prime locations."
      />
      <PageHero
        eyebrow="Properties for Sale"
        title="Buy Your Dream Home"
        subtitle="Explore our curated collection of premium residences available for purchase."
        breadcrumb="Buy"
        image="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80"
      />
      <PropertyListing listingType="buy" />
    </>
  );
}
