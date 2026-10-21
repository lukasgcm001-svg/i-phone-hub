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

  // Handle wix:image:// format
  if (imageUrl.startsWith('wix:image://')) {
    // Extract the image ID from wix:image://v1/[imageId]
    const match = imageUrl.match(/wix:image:\/\/v1\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      const imageId = match[1];
      // Return Wix media URL format
      return `https://static.wixstatic.com/media/${imageId}~mv2.jpg`;
    }
  }

  return imageUrl;
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
 */
export function getMinProductPrice(product: any): number {
  if (!product) return 0;

  // If product has variants with prices
  if (product.variants && Array.isArray(product.variants)) {
    const prices = product.variants
      .map((v: any) => v.price || v.priceData?.price)
      .filter((p: any) => p && p > 0);
    if (prices.length > 0) {
      return Math.min(...prices);
    }
  }

  // Try various price field names
  const price =
    product.price ||
    product.priceData?.price ||
    product.price_data?.price ||
    0;

  return price > 0 ? price : 0;
}
