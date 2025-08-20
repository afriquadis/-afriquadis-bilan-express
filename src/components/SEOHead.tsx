import Head from 'next/head';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article';
}

export default function SEOHead({
  title = 'Bilan Express - Diagnostic de Santé Intelligent AFRIQUADIS',
  description = 'Réalisez un bilan de santé complet et personnalisé basé sur vos symptômes avec l\'intelligence artificielle. Recommandations naturelles AFRIQUADIS.',
  keywords = ['diagnostic', 'santé', 'symptômes', 'AFRIQUADIS', 'bilan', 'médical', 'naturel'],
  image = '/icon.svg',
  url = 'https://bilan-express.afriquadis.com',
  type = 'website'
}: SEOHeadProps) {
  const keywordsString = keywords.join(', ');

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywordsString} />
      <meta name="author" content="AFRIQUADIS" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="French" />
      <meta name="revisit-after" content="7 days" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="AFRIQUADIS Bilan Express" />
      <meta property="og:locale" content="fr_FR" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Additional Medical/Health Meta Tags */}
      <meta name="medical-disclaimer" content="Ce diagnostic est indicatif et ne remplace pas une consultation médicale professionnelle." />
      <meta name="health-topic" content="Diagnostic médical, Santé naturelle, Produits AFRIQUADIS" />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "AFRIQUADIS Bilan Express",
            "description": description,
            "url": url,
            "applicationCategory": "HealthApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "EUR"
            },
            "provider": {
              "@type": "Organization",
              "name": "AFRIQUADIS",
              "url": "https://afriquadis.com"
            }
          })
        }}
      />
    </Head>
  );
}
