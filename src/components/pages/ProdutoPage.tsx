import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Check } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Image } from '@/components/ui/image';
import { BaseCrudService } from '@/integrations';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface ProductVariant {
  _id: string;
  name: string;
  price: number;
  color?: string;
  storage?: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  description?: string;
  mainImage?: {
    url: string;
  };
  images?: Array<{
    url: string;
  }>;
  variants?: ProductVariant[];
  productType?: string;
  sku?: string;
}

export default function ProdutoPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedStorage, setSelectedStorage] = useState<string | null>(null);
  const [mainImage, setMainImage] = useState<string>('');

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setIsLoading(true);
        if (!id) return;

        const data = await BaseCrudService.getById<Product>('StoreCatalog/Products', id, {
          multiRef: ['variants']
        });

        if (data) {
          setProduct(data);
          setMainImage(data.mainImage?.url || '');
          
          // Set default variant
          if (data.variants && data.variants.length > 0) {
            setSelectedVariant(data.variants[0]);
          }
        }
      } catch (error) {
        console.error('Error loading product:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const getUniqueColors = (): string[] => {
    if (!product?.variants) return [];
    const colors = product.variants
      .map(v => v.color)
      .filter((c): c is string => !!c);
    return [...new Set(colors)];
  };

  const getUniqueStorage = (): string[] => {
    if (!product?.variants) return [];
    const storage = product.variants
      .map(v => v.storage)
      .filter((s): s is string => !!s);
    return [...new Set(storage)];
  };

  const getVariantPrice = (): number => {
    if (selectedVariant) {
      return selectedVariant.price;
    }
    return product?.price || 0;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <Header />
        <WhatsAppButton />
        <LoadingSpinner />
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <WhatsAppButton />
        <div className="w-full max-w-[100rem] mx-auto px-6 md:px-12 pt-32 pb-24 text-center">
          <h1 className="text-4xl font-heading font-bold mb-4">Produto não encontrado</h1>
          <Link to="/loja" className="text-primary hover:underline">
            Voltar para a loja
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const colors = getUniqueColors();
  const storage = getUniqueStorage();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <WhatsAppButton />

      <section className="w-full max-w-[100rem] mx-auto px-6 md:px-12 pt-32 pb-24">
        {/* Back Button */}
        <Link
          to="/loja"
          className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors mb-12 font-paragraph"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar para a loja
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Product Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-4"
          >
            {/* Main Image */}
            <div className="w-full aspect-square bg-surface border border-line rounded-[6px] overflow-hidden">
              {mainImage ? (
                <Image
                  src={mainImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-line/20">
                  <span className="text-secondary">Sem imagem</span>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 0 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setMainImage(img.url)}
                    className={`aspect-square rounded-[4px] overflow-hidden border-2 transition-all ${
                      mainImage === img.url
                        ? 'border-primary'
                        : 'border-line hover:border-primary/50'
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={`${product.name} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col"
          >
            <div className="mb-8">
              <p className="text-xs uppercase tracking-wider text-secondary mb-4 font-paragraph">
                {product.productType || 'Produto'}
              </p>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
                {product.name}
              </h1>
              <p className="text-3xl font-heading font-bold text-primary">
                {formatPrice(getVariantPrice())}
              </p>
            </div>

            {/* Color Selector */}
            {colors.length > 0 && (
              <div className="mb-8">
                <label className="block text-sm font-paragraph font-semibold text-foreground mb-4">
                  Cor
                </label>
                <div className="flex flex-wrap gap-3">
                  {colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-6 py-3 rounded-[6px] font-paragraph font-medium transition-all ${
                        selectedColor === color
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-surface border border-line text-foreground hover:border-primary'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Storage Selector */}
            {storage.length > 0 && (
              <div className="mb-8">
                <label className="block text-sm font-paragraph font-semibold text-foreground mb-4">
                  Armazenamento
                </label>
                <div className="flex flex-wrap gap-3">
                  {storage.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedStorage(size)}
                      className={`px-6 py-3 rounded-[6px] font-paragraph font-medium transition-all ${
                        selectedStorage === size
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-surface border border-line text-foreground hover:border-primary'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {product.description && (
              <div className="mb-8 pb-8 border-b border-line">
                <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
                  Descrição
                </h3>
                <p className="text-secondary font-paragraph leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Info Sections */}
            <div className="space-y-6 mb-12">
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <Check className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-foreground mb-1">Garantia</h4>
                  <p className="text-secondary font-paragraph text-sm">
                    Garantia de 1 ano para produtos novos e 90 dias para seminovos, além da garantia Apple.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <Check className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-foreground mb-1">Procedência Certificada</h4>
                  <p className="text-secondary font-paragraph text-sm">
                    Todos os produtos são originais Apple com nota fiscal e rastreabilidade completa.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <Check className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-foreground mb-1">Entrega Rápida</h4>
                  <p className="text-secondary font-paragraph text-sm">
                    Entregamos em todo o Brasil com prazo de 3 a 10 dias úteis, dependendo da sua região.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={`https://wa.me/[NÚMERO DO WHATSAPP]?text=Olá, tenho interesse no ${product.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center bg-primary text-primary-foreground px-8 py-4 rounded-[6px] font-paragraph font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Comprar via WhatsApp
              </a>
              <Link
                to="/loja"
                className="flex-1 inline-flex items-center justify-center bg-surface border border-line text-foreground px-8 py-4 rounded-[6px] font-paragraph font-semibold transition-all hover:border-primary hover:text-primary"
              >
                Voltar ao Catálogo
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
