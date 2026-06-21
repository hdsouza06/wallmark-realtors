import { Helmet } from "react-helmet-async";
import { SITE } from "../config/site";

export default function Seo({
  title,
  description = "Wallmark Realtors — real estate consultants in Mumbai, Pune, Goa & Dubai. Buy, sell & lease residential and commercial properties, home loans and interiors.",
  image = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
  type = "website",
  schema,
}) {
  const fullTitle = title ? `${title} | ${SITE.name}` : `${SITE.name} | Premium Real Estate`;
  const url = typeof window !== "undefined" ? window.location.href : "";

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={SITE.name} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {schema && <script type="application/ld+json">{JSON.stringify(schema)}</script>}
    </Helmet>
  );
}
