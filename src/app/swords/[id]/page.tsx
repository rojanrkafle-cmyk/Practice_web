import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const sword = await prisma.sword.findUnique({
    where: { id: params.id }
  });

  if (!sword) {
    return {
      title: 'Sword Not Found',
      description: 'The requested sword could not be found.'
    };
  }

  const ogImage = new URL(sword.image).toString();

  return {
    title: `${sword.name} (${sword.nameJapanese}) | Japanese Swords`,
    description: sword.description,
    openGraph: {
      title: sword.name,
      description: sword.description,
      images: [{
        url: ogImage,
        width: 1200,
        height: 630,
        alt: `${sword.name} - ${sword.nameJapanese}`
      }],
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: sword.name,
      description: sword.description,
      images: [ogImage]
    }
  };
}

function generateJsonLd(sword: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: sword.name,
    description: sword.description,
    image: sword.image,
    offers: {
      '@type': 'Offer',
      price: sword.price,
      priceCurrency: 'USD',
      availability: sword.available 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock',
      url: `https://yourwebsite.com/swords/${sword.id}`
    },
    brand: {
      '@type': 'Brand',
      name: 'Japanese Swords'
    },
    manufacturer: {
      '@type': 'Organization',
      name: sword.craftsman
    },
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Category',
        value: sword.category
      },
      {
        '@type': 'PropertyValue',
        name: 'Era',
        value: sword.era
      },
      ...Object.entries(sword.specifications).map(([key, value]) => ({
        '@type': 'PropertyValue',
        name: key,
        value: value
      }))
    ]
  };
}

export default async function SwordPage({ params }: Props) {
  const sword = await prisma.sword.findUnique({
    where: { id: params.id }
  });

  if (!sword) {
    notFound();
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateJsonLd(sword))
        }}
      />
      {/* Your sword page component content */}
    </>
  );
}