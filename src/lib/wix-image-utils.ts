/**
 * Converts Wix image URLs to public image URLs
 * Handles wix:image:// format and other Wix image formats
 */
export function convertWixImageUrl(imageUrl: string | undefined): string | undefined {
  if (!imageUrl) return undefined;

  // If it's already a public URL, return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // Handle wix:image:// format: wix:image://v1/{ID_WITH_EXTENSION}/{name}#originWidth=...
  if (imageUrl.startsWith('wix:image://')) {
    // Extract the image ID (between v1/ and the next /)
    const match = imageUrl.match(/wix:image:\/\/v1\/([^/]+)/);
    if (match && match[1]) {
      const imageId = match[1];
      // Return Wix media URL format
      return `https://static.wixstatic.com/media/${imageId}`;
    }
  }

  return imageUrl;
}

/**
 * Capitalizes the first letter of a string
 */
export function capitalizeFirstLetter(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Converts price from string (in cents) to number and formats as BRL
 */
export function convertAndFormatPrice(priceString: string | number | undefined): { amount: number; formatted: string } {
  if (!priceString) {
    return { amount: 0, formatted: '' };
  }

  // Convert to number if string
  let amount = typeof priceString === 'string' ? parseInt(priceString, 10) : priceString;
  
  // If amount is 0 or invalid, return empty
  if (!amount || amount <= 0) {
    return { amount: 0, formatted: '' };
  }

  // Convert from cents to reais (divide by 100)
  amount = amount / 100;

  // Format as BRL
  const formatted = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount);

  return { amount, formatted };
}

/**
 * Extracts the main image from a product
 * Handles various Wix Stores product image field formats
 */
export function getProductMainImage(product: any): string | undefined {
  // Try common image field names in Wix Stores
  const imageUrls = [
    product.mainImage?.url,
    product.image?.url,
    product.media?.mainMedia?.image?.url,
    product.media?.items?.[0]?.image?.url,
    product.images?.[0]?.url,
  ];

  for (const url of imageUrls) {
    if (url) {
      return convertWixImageUrl(url);
    }
  }

  return undefined;
}

/**
 * Extracts all product images
 * Handles various Wix Stores product image field formats
 */
export function getProductImages(product: any): string[] {
  const images: string[] = [];

  // Try to get images from various possible fields
  const imageSources = [
    product.images,
    product.media?.items?.map((item: any) => item.image),
  ];

  for (const source of imageSources) {
    if (Array.isArray(source)) {
      for (const item of source) {
        const url = item?.url || item;
        if (url) {
          const converted = convertWixImageUrl(url);
          if (converted && !images.includes(converted)) {
            images.push(converted);
          }
        }
      }
    }
  }

  return images;
}

/**
 * Gets the minimum price from a product or its variants
 * Uses actualPriceRange.minValue.amount field from Wix Stores
 * NOTE: actualPriceRange.minValue.amount is already in Reais (not cents)
 */
export function getMinProductPrice(product: any): number {
  if (!product) return 0;

  // Check for actualPriceRange.minValue.amount (Wix Stores format - already in Reais)
  if (product.actualPriceRange?.minValue?.amount) {
    const priceString = product.actualPriceRange.minValue.amount;
    const amount = typeof priceString === 'string' ? parseInt(priceString, 10) : priceString;
    if (amount && amount > 0) {
      return amount; // Already in Reais, no division needed
    }
  }

  // If product has variants with prices
  if (product.variants && Array.isArray(product.variants)) {
    const prices = product.variants
      .map((v: any) => {
        // Check variant's actualPriceRange
        if (v.actualPriceRange?.minValue?.amount) {
          const priceString = v.actualPriceRange.minValue.amount;
          const amount = typeof priceString === 'string' ? parseInt(priceString, 10) : priceString;
          return amount ? amount : 0; // Already in Reais
        }
        return v.price || v.priceData?.price || 0;
      })
      .filter((p: any) => p && p > 0);
    if (prices.length > 0) {
      return Math.min(...prices);
    }
  }

  // Fallback to other price field names
  const price =
    product.price ||
    product.priceData?.price ||
    product.price_data?.price ||
    0;

  return price > 0 ? price : 0;
}
