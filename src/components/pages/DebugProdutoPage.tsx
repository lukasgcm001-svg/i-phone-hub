import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { BaseCrudService } from '@/integrations';

export default function DebugProdutoPage() {
  const [product, setProduct] = useState<any>(null);
  const [variants, setVariants] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [variantsError, setVariantsError] = useState<string | null>(null);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        setVariantsError(null);
        setCategoriesError(null);

        // Fetch first product from Wix Stores
        const productResult = await BaseCrudService.getAll<any>(
          'StoreCatalog/Products',
          {},
          { limit: 1 }
        );

        if (productResult.items && productResult.items.length > 0) {
          setProduct(productResult.items[0]);
        } else {
          setError('No products found in Wix Stores');
        }

        // Fetch all products for category mapping
        const allProductsResult = await BaseCrudService.getAll<any>(
          'StoreCatalog/Products',
          {},
          { limit: 100 }
        );
        setProducts(allProductsResult.items || []);

        // Fetch variants
        try {
          const variantsResult = await BaseCrudService.getAll<any>(
            'StoreCatalog/Variants',
            {},
            { limit: 100 }
          );
          setVariants(variantsResult.items || []);
        } catch (err) {
          setVariantsError(err instanceof Error ? err.message : 'Failed to load variants');
        }

        // Fetch categories
        try {
          const categoriesResult = await BaseCrudService.getAll<any>(
            'StoreCatalog/Categories',
            {},
            { limit: 100 }
          );
          setCategories(categoriesResult.items || []);
        } catch (err) {
          setCategoriesError(err instanceof Error ? err.message : 'Failed to load categories');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Build category-to-products mapping
  const categoryProductsMap: Record<string, any[]> = {};
  categories.forEach(cat => {
    categoryProductsMap[cat._id] = products.filter(p => p.categories?.includes(cat._id));
  });

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background text-foreground">
        <div className="max-w-[100rem] mx-auto px-4 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-heading font-bold mb-2">Debug: Wix Stores Data</h1>
            <p className="text-secondary text-sm">Raw JSON objects for diagnosis</p>
          </div>

          {loading && (
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner />
            </div>
          )}

          {error && (
            <div className="bg-destructive/20 border border-destructive rounded-lg p-4 text-destructive mb-8">
              <p className="font-semibold">Error loading product:</p>
              <p>{error}</p>
            </div>
          )}

          {/* First Product */}
          {product && (
            <div className="mb-12">
              <h2 className="text-2xl font-heading font-bold mb-4 text-primary">First Product</h2>
              <div className="bg-surface border border-line rounded-lg p-6 overflow-auto">
                <pre className="text-xs font-mono text-foreground whitespace-pre-wrap break-words">
                  {JSON.stringify(product, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Variants */}
          <div className="mb-12">
            <h2 className="text-2xl font-heading font-bold mb-4 text-primary">Variants from First Product</h2>
            {variantsError && (
              <div className="bg-destructive/20 border border-destructive rounded-lg p-4 text-destructive mb-4">
                <p className="font-semibold">Error loading variants:</p>
                <p>{variantsError}</p>
              </div>
            )}
            {variants.length > 0 ? (
              <div className="bg-surface border border-line rounded-lg p-6 overflow-auto">
                <pre className="text-xs font-mono text-foreground whitespace-pre-wrap break-words">
                  {JSON.stringify(variants, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="bg-surface border border-line rounded-lg p-6">
                <p className="text-secondary">No variants found</p>
              </div>
            )}
          </div>

          {/* Categories and Product Mapping */}
          <div className="mb-12">
            <h2 className="text-2xl font-heading font-bold mb-4 text-primary">Categories & Product Mapping</h2>
            {categoriesError && (
              <div className="bg-destructive/20 border border-destructive rounded-lg p-4 text-destructive mb-4">
                <p className="font-semibold">Error loading categories:</p>
                <p>{categoriesError}</p>
              </div>
            )}
            {categories.length > 0 ? (
              <div className="bg-surface border border-line rounded-lg p-6 overflow-auto">
                <pre className="text-xs font-mono text-foreground whitespace-pre-wrap break-words">
                  {JSON.stringify(
                    categories.map(cat => ({
                      ...cat,
                      products: categoryProductsMap[cat._id] || []
                    })),
                    null,
                    2
                  )}
                </pre>
              </div>
            ) : (
              <div className="bg-surface border border-line rounded-lg p-6">
                <p className="text-secondary">No categories found</p>
              </div>
            )}
          </div>

          {!loading && !error && !product && (
            <div className="text-center py-20">
              <p className="text-secondary">No product data available</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
