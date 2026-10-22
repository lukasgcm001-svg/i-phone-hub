import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Image } from '@/components/ui/image';
import { BaseCrudService } from '@/integrations';
import { convertWixImageUrl, getMinProductPrice, convertAndFormatPrice } from '@/lib/wix-image-utils';
import { categories } from '@wix/categories';

interface Product {
  _id: string;
  name: string;
  price?: number;
  priceData?: { price: number };
  mainImage?: {
    url: string;
  };
  image?: {
    url: string;
  };
  media?: any;
  productType?: string;
  categories?: string[];
  mainCategoryId?: string;
  variants?: Array<{
    _id: string;
    price?: number;
    priceData?: { price: number };
  }>;
}

interface Category {
  _id: string;
  name: string;
  displayOrder?: number;
}

// Constants
const FEATURED_CATEGORY_ID = 'a7f817f7-8ac1-43b2-91c3-9072a41ad0fa';
const ROOT_CATEGORY_NAME = 'Todos os produtos';

export default function LojaPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  // Load categories from Wix Categories API
  useEffect(() => {
    const loadCategories = async () => {
      try {
        // Step 1: Log typeof for each method to detect available functions
        console.log('=== DETECTING AVAILABLE METHODS ===');
        console.log('typeof categories.searchCategories:', typeof categories.searchCategories);
        console.log('typeof categories.queryCategories:', typeof categories.queryCategories);
        console.log('typeof categories.listCategories:', typeof categories.listCategories);
        console.log('typeof categories.getCategory:', typeof categories.getCategory);
        console.log('typeof categories.listItemsInCategory:', typeof categories.listItemsInCategory);
        console.log('=== END METHOD DETECTION ===');

        // Step 2: Try to fetch categories using available method
        let result;
        
        if (typeof categories.searchCategories === 'function') {
          console.log('Using searchCategories method...');
          result = await categories.searchCategories({
            query: {
              filter: {
                'treeReference.appNamespace': '@wix/stores',
                'visible': true
              }
            }
          });
          console.log('Raw searchCategories result:', result);
        } else if (typeof categories.queryCategories === 'function') {
          console.log('Using queryCategories method...');
          result = await categories.queryCategories({
            query: {
              filter: {
                'treeReference.appNamespace': '@wix/stores',
                'visible': true
              }
            }
          });
          console.log('Raw queryCategories result:', result);
        } else if (typeof categories.listCategories === 'function') {
          console.log('Using listCategories method...');
          result = await categories.listCategories({
            query: {
              filter: {
                'treeReference.appNamespace': '@wix/stores',
                'visible': true
              }
            }
          });
          console.log('Raw listCategories result:', result);
        } else {
          throw new Error('No suitable method found to fetch categories. Available methods: searchCategories, queryCategories, listCategories');
        }

        // Step 3: Filter and sort categories
        const allCategories = (result.items || [])
          .filter((cat: any) => {
            // Exclude root category and featured category
            return cat.name !== ROOT_CATEGORY_NAME && cat._id !== FEATURED_CATEGORY_ID;
          })
          .sort((a: any, b: any) => {
            // Sort by displayOrder if available, otherwise alphabetically
            if (a.displayOrder !== undefined && b.displayOrder !== undefined) {
              return a.displayOrder - b.displayOrder;
            }
            return (a.name || '').localeCompare(b.name || '');
          });

        console.log('Filtered and sorted categories:', allCategories);
        setCategories(allCategories);
      } catch (error) {
        console.error('Error loading categories:', error);
        console.log('Full error object:', error);
      }
    };

    loadCategories();
  }, []);

  // Load all products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        const productsResult = await BaseCrudService.getAll<Product>('StoreCatalog/Products', {}, { limit: 100 });
        const allProducts = productsResult.items || [];
        setProducts(allProducts);
        setFilteredProducts(allProducts);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Filter products by selected category
  useEffect(() => {
    if (selectedCategory) {
      const filterProductsByCategory = async () => {
        try {
          setIsLoading(true);
          
          // Get items in the selected category
          const categoryItems = await categories.listItemsInCategory(
            selectedCategory,
            { appNamespace: '@wix/stores' }
          );

          console.log(`Raw listItemsInCategory result for category ${selectedCategory}:`, categoryItems);

          // Extract catalogItemIds
          const categoryItemIds = (categoryItems.items || []).map((item: any) => item.catalogItemId);

          if (categoryItemIds.length === 0) {
            setFilteredProducts([]);
            return;
          }

          // Filter products by the category item IDs
          const filtered = products.filter(product => categoryItemIds.includes(product._id));
          setFilteredProducts(filtered);
        } catch (error) {
          console.error(`Error filtering products for category ${selectedCategory}:`, error);
          console.log('Full error object:', error);
          setFilteredProducts([]);
        } finally {
          setIsLoading(false);
        }
      };

      filterProductsByCategory();
    } else {
      setFilteredProducts(products);
      setIsLoading(false);
    }
  }, [selectedCategory, products]);

  const getProductImage = (product: Product): string | undefined => {
    // Use media.main.image from Wix Stores
    const imageUrl = product.media?.main?.image;
    return convertWixImageUrl(imageUrl);
  };

  const getMinPrice = (product: Product): number => {
    return getMinProductPrice(product);
  };

  const formatPrice = (price: number): string => {
    if (price === 0) return '';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <WhatsAppButton />

      <section className="w-full max-w-[100rem] mx-auto px-6 md:px-12 pt-32 pb-24 md:pt-40 md:pb-32">
        <div className="mb-16">
          <p className="text-xs uppercase tracking-wider text-secondary mb-4 font-paragraph">
            Catálogo Completo
          </p>
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-foreground mb-6">
            Nossos <span className="text-primary">iPhones</span>
          </h1>
          <p className="text-lg text-secondary max-w-3xl font-paragraph">
            Explore nossa seleção de iPhones novos e seminovos. Todos com garantia e procedência certificada.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-12 flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-6 py-3 rounded-[6px] font-paragraph font-medium transition-all ${
              selectedCategory === null
                ? 'bg-primary text-primary-foreground'
                : 'bg-surface border border-line text-foreground hover:border-primary'
            }`}
          >
            Todos
          </button>
          {categories.map(category => (
            <button
              key={category._id}
              onClick={() => setSelectedCategory(category._id)}
              className={`px-6 py-3 rounded-[6px] font-paragraph font-medium transition-all ${
                selectedCategory === category._id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-surface border border-line text-foreground hover:border-primary'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-surface border border-line rounded-[6px] p-6 animate-pulse">
                <div className="w-full h-64 bg-line rounded-[4px] mb-4" />
                <div className="h-6 bg-line rounded mb-2" />
                <div className="h-4 bg-line rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group bg-surface border border-line rounded-[6px] overflow-hidden hover:border-primary transition-all duration-300"
              >
                {/* Product Image */}
                <div className="relative w-full h-64 bg-background overflow-hidden">
                  {getProductImage(product) ? (
                    <Image
                      src={getProductImage(product)!}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-line/20">
                      <span className="text-secondary text-sm">Sem imagem</span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <h3 className="text-lg font-heading font-semibold text-foreground mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  
                  {getMinPrice(product) > 0 && (
                    <p className="text-sm text-secondary font-paragraph mb-6">
                      a partir de <span className="text-primary font-semibold">{formatPrice(getMinPrice(product))}</span>
                    </p>
                  )}

                  <Link
                    to={`/produto/${product._id}`}
                    className="w-full inline-flex items-center justify-center bg-primary text-primary-foreground px-6 py-3 rounded-[6px] font-paragraph font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Ver Detalhes
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-secondary font-paragraph text-lg">
              Nenhum produto encontrado nesta categoria.
            </p>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
