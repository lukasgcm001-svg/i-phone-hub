import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { BaseCrudService } from '@/integrations';

export default function DebugProdutoPage() {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch first product from Wix Stores with all references
        const result = await BaseCrudService.getAll<any>(
          'StoreCatalog/Products',
          {
            multiRef: ['variants', 'media', 'images'],
            singleRef: ['mainImage']
          },
          { limit: 1 }
        );

        if (result.items && result.items.length > 0) {
          setProduct(result.items[0]);
        } else {
          setError('No products found in Wix Stores');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, []);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background text-foreground">
        <div className="max-w-[100rem] mx-auto px-4 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-heading font-bold mb-2">Debug: First Product from Wix Stores</h1>
            <p className="text-secondary text-sm">This page displays the raw JSON object of the first product to diagnose field structure</p>
          </div>

          {loading && (
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner />
            </div>
          )}

          {error && (
            <div className="bg-destructive/20 border border-destructive rounded-lg p-4 text-destructive">
              <p className="font-semibold">Error:</p>
              <p>{error}</p>
            </div>
          )}

          {product && (
            <div className="bg-surface border border-line rounded-lg p-6 overflow-auto">
              <pre className="text-xs font-mono text-foreground whitespace-pre-wrap break-words">
                {JSON.stringify(product, null, 2)}
              </pre>
            </div>
          )}

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
