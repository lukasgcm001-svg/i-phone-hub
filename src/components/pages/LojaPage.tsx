import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Image } from '@/components/ui/image';
import { BaseCrudService } from '@/integrations';

interface Product {
  _id: string;
  name: string;
  price: number;
  mainImage?: {
    url: string;
  };
  productType?: string;
  variants?: Array<{
    _id: string;
    price: number;
  }>;
}

interface Category {
  _id: string;
  name: string;
}

export default function LojaPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch products from Wix Stores
        const productsResult = await BaseCrudService.getAll<Product>('StoreCatalog/Products', {}, { limit: 100 });
        const allProducts = productsResult.items || [];
        
        // Fetch categories
        const categoriesResult = await BaseCrudService.getAll<Category>('StoreCatalog/Categories', {}, { limit: 100 });
        const allCategories = categoriesResult.items || [];
        
        setProducts(allProducts);
        setCategories(allCategories);
        setFilteredProducts(allProducts);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      const filtered = products.filter(product => {
        // Filter by category - you may need to adjust based on actual product structure
        return product.productType === selectedCategory || product._id.includes(selectedCategory);
      });
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [selectedCategory, products]);

  const getMinPrice = (product: Product): number => {
    if (product.variants && product.variants.length > 0) {
      return Math.min(...product.variants.map(v => v.price || product.price));
    }
    return product.price || 0;
  };

  const formatPrice = (price: number): string => {
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
                  {product.mainImage?.url ? (
                    <Image
                      src={product.mainImage.url}
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
                  
                  <p className="text-sm text-secondary font-paragraph mb-6">
                    a partir de <span className="text-primary font-semibold">{formatPrice(getMinPrice(product))}</span>
                  </p>

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
