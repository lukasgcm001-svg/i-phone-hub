import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown, X } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Image } from '@/components/ui/image';
import { BaseCrudService } from '@/integrations';
import { convertWixImageUrl, getMinProductPrice, convertAndFormatPrice } from '@/lib/wix-image-utils';
import { categories as wixCategories } from '@wix/categories';
import { getCategoriesFromWix } from '@/lib/get-categories';

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

interface CategoryItem {
  id: string;
  name: string;
  itemCounter?: number;
}

export default function LojaPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryList, setCategoryList] = useState<CategoryItem[]>([]);
  const [selectedCondition, setSelectedCondition] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load categories from backend web method
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const result = await getCategoriesFromWix();
        setCategoryList(result);
      } catch (error) {
        console.error('Error loading categories:', error);
        setError('Erro ao carregar categorias');
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
        setError('Erro ao carregar produtos');
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Separate categories into condition and model
  const conditionCategories = categoryList.filter(cat => 
    (cat.name === 'Novos' || cat.name === 'Seminovos') && (cat.itemCounter || 0) > 0
  );

  const modelCategories = categoryList.filter(cat => 
    cat.name !== 'All Products' && 
    cat.name !== 'Destaques' && 
    cat.name !== 'Novos' && 
    cat.name !== 'Seminovos' &&
    (cat.itemCounter || 0) > 0
  ).sort((a, b) => {
    // Extract numbers from iPhone names and sort descending (newest first)
    const numA = parseInt(a.name.match(/\d+/)?.[0] || '0');
    const numB = parseInt(b.name.match(/\d+/)?.[0] || '0');
    return numB - numA;
  });

  // Filter products based on selected condition and model
  useEffect(() => {
    const filterProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        let conditionItemIds: string[] = [];
        let modelItemIds: string[] = [];

        // Get items for selected condition
        if (selectedCondition) {
          const conditionCategory = categoryList.find(cat => cat.name === selectedCondition);
          if (conditionCategory) {
            const categoryItems = await wixCategories.listItemsInCategory(
              conditionCategory.id,
              { appNamespace: '@wix/stores' }
            );
            conditionItemIds = (categoryItems.items || []).map((item: any) => item.catalogItemId);
          }
        }

        // Get items for selected model
        if (selectedModel) {
          const modelCategory = categoryList.find(cat => cat.name === selectedModel);
          if (modelCategory) {
            const categoryItems = await wixCategories.listItemsInCategory(
              modelCategory.id,
              { appNamespace: '@wix/stores' }
            );
            modelItemIds = (categoryItems.items || []).map((item: any) => item.catalogItemId);
          }
        }

        // Apply filters
        let filtered = products;

        if (selectedCondition && selectedModel) {
          // Both selected: intersection
          const intersection = conditionItemIds.filter(id => modelItemIds.includes(id));
          filtered = products.filter(product => intersection.includes(product._id));
        } else if (selectedCondition) {
          // Only condition selected
          filtered = products.filter(product => conditionItemIds.includes(product._id));
        } else if (selectedModel) {
          // Only model selected
          filtered = products.filter(product => modelItemIds.includes(product._id));
        }

        setFilteredProducts(filtered);
      } catch (error) {
        console.error('Error filtering products:', error);
        setError('Erro ao filtrar produtos');
        setFilteredProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    filterProducts();
  }, [selectedCondition, selectedModel, products, categoryList]);

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

  const hasActiveFilters = selectedCondition !== null || selectedModel !== null;

  const handleClearFilters = () => {
    setSelectedCondition(null);
    setSelectedModel(null);
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

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-4 bg-destructive/10 border border-destructive rounded-[6px]">
            <p className="text-destructive font-paragraph text-sm">{error}</p>
          </div>
        )}

        {/* Filters - Two Dropdowns */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-6">
            {/* Condition Dropdown */}
            <div className="flex-1">
              <label className="block text-xs uppercase tracking-wider text-secondary mb-2 font-paragraph">
                Condição
              </label>
              <div className="relative">
                <select
                  value={selectedCondition || ''}
                  onChange={(e) => setSelectedCondition(e.target.value || null)}
                  className="w-full appearance-none bg-surface border border-line text-foreground px-4 py-3 rounded-[6px] font-paragraph text-sm transition-all focus:outline-none focus:border-primary hover:border-primary cursor-pointer"
                >
                  <option value="">Todos</option>
                  {conditionCategories.map(category => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary pointer-events-none" />
              </div>
            </div>

            {/* Model Dropdown */}
            <div className="flex-1">
              <label className="block text-xs uppercase tracking-wider text-secondary mb-2 font-paragraph">
                Modelo
              </label>
              <div className="relative">
                <select
                  value={selectedModel || ''}
                  onChange={(e) => setSelectedModel(e.target.value || null)}
                  className="w-full appearance-none bg-surface border border-line text-foreground px-4 py-3 rounded-[6px] font-paragraph text-sm transition-all focus:outline-none focus:border-primary hover:border-primary cursor-pointer"
                >
                  <option value="">Todos</option>
                  {modelCategories.map(category => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="text-xs text-secondary hover:text-primary transition-colors font-paragraph flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              Limpar filtros
            </button>
          )}
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
              Nenhum produto encontrado com esses filtros.
            </p>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
