import { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, MotionConfig } from 'framer-motion';
import { X } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Image } from '@/components/ui/image';
import { BaseCrudService } from '@/integrations';
import { convertWixImageUrl, getMinProductPrice } from '@/lib/wix-image-utils';
import { categories as wixCategories } from '@wix/categories';
import { getCategoriesFromWix } from '@/lib/get-categories';

const WHATSAPP_NUMBER = '5531973418394';

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
}

// "iPhone 17" -> "iphone-17", "Seminovos" -> "seminovos": o valor que vai na URL.
const slugify = (name: string) =>
  name.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// Destaques é só da Home; All Products é a categoria raiz do Wix Stores.
const isFilterCategory = (cat: CategoryItem) => slugify(cat.name) !== 'destaques' && cat.name !== 'All Products';
const isModel = (cat: CategoryItem) => /iphone\s*\d+/i.test(cat.name);
const modelNumber = (cat: CategoryItem) => parseInt(cat.name.match(/\d+/)?.[0] || '0', 10);

function FilterGroup({
  label,
  options,
  selectedId,
  onSelect,
}: {
  label: string;
  options: CategoryItem[];
  selectedId?: string;
  onSelect: (category: CategoryItem | null) => void;
}) {
  const chip =
    'snap-start shrink-0 inline-flex items-center justify-center min-h-[2.75rem] px-5 rounded-full border font-paragraph text-sm font-medium touch-manipulation transition-[transform,background-color,color] duration-100 active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';
  const inactive = 'border-[rgba(255,255,255,0.12)] text-foreground';
  const active = 'bg-primary border-primary text-primary-foreground';

  return (
    <div role="group" aria-label={label}>
      <p className="block text-xs uppercase tracking-wider text-secondary mb-2 font-paragraph">{label}</p>
      {/* p-1 -m-1: deixa o contorno de foco de 2px aparecer dentro da área rolável */}
      <div className="flex gap-2 p-1 -m-1 overflow-x-auto snap-x snap-mandatory scroll-px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:flex-wrap md:overflow-visible md:snap-none">
        <button
          type="button"
          aria-pressed={!selectedId}
          onClick={() => onSelect(null)}
          className={`${chip} ${selectedId ? inactive : active}`}
        >
          Todos
        </button>
        {options.map((category) => {
          const pressed = category.id === selectedId;
          return (
            <button
              key={category.id}
              type="button"
              aria-pressed={pressed}
              onClick={() => onSelect(pressed ? null : category)}
              className={`${chip} ${pressed ? active : inactive}`}
            >
              {category.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function LojaPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  // null = ainda carregando
  const [products, setProducts] = useState<Product[] | null>(null);
  const [categoryList, setCategoryList] = useState<CategoryItem[]>([]);
  const [idsByCategory, setIdsByCategory] = useState<Record<string, Set<string>> | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Categorias do Wix Stores e, para cada uma, os ids dos produtos dentro dela.
  useEffect(() => {
    const load = async () => {
      try {
        const list: CategoryItem[] = (await getCategoriesFromWix()).filter(isFilterCategory);
        setCategoryList(list);

        const entries = await Promise.all(
          list.map(async (cat) => {
            // shortcut: sem paginação, vale para poucas dezenas de produtos por categoria; usar paging se passar disso
            const result = await wixCategories.listItemsInCategory(cat.id, { appNamespace: '@wix/stores' });
            return [cat.id, new Set<string>((result.items || []).map((item: any) => item.catalogItemId))] as const;
          })
        );
        setIdsByCategory(Object.fromEntries(entries));
      } catch (err) {
        console.error('Error loading categories:', err);
        setError('Erro ao carregar categorias');
        setIdsByCategory({});
      }
    };

    load();
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await BaseCrudService.getAll<Product>('StoreCatalog/Products', {}, { limit: 100 });
        setProducts(result.items || []);
      } catch (err) {
        console.error('Error loading products:', err);
        setError('Erro ao carregar produtos');
        setProducts([]);
      }
    };

    load();
  }, []);

  const isLoading = products === null || idsByCategory === null;

  // Modelos: categorias "iPhone N", do mais novo ao mais antigo. Condição: as demais.
  const modelCategories = useMemo(
    () => categoryList.filter(isModel).sort((a, b) => modelNumber(b) - modelNumber(a)),
    [categoryList]
  );
  const conditionCategories = useMemo(
    () => categoryList.filter((cat) => !isModel(cat)).sort((a, b) => a.name.localeCompare(b.name, 'pt-BR')),
    [categoryList]
  );

  const condition = conditionCategories.find((cat) => slugify(cat.name) === searchParams.get('condicao'));
  const model = modelCategories.find((cat) => slugify(cat.name) === searchParams.get('modelo'));

  const filteredProducts = useMemo(
    () =>
      (products ?? []).filter((product) =>
        [condition, model].every((cat) => !cat || idsByCategory?.[cat.id]?.has(product._id))
      ),
    [products, idsByCategory, condition, model]
  );

  // Categoria escolhida que não tem nenhum produto (ex.: Seminovos hoje)
  const emptyCategory = [condition, model].find((cat) => cat && !idsByCategory?.[cat.id]?.size);

  const setFilter = (param: 'condicao' | 'modelo', category: CategoryItem | null) => {
    const next = new URLSearchParams(searchParams);
    if (category) next.set(param, slugify(category.name));
    else next.delete(param);
    setSearchParams(next);
  };

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

  const hasActiveFilters = Boolean(condition || model);

  const handleClearFilters = () => setSearchParams(new URLSearchParams());

  const emptyWhatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Olá, vim pelo site e quero saber sobre ${emptyCategory?.name.toLowerCase() ?? 'iPhones'}.`
  )}`;

  return (
    <MotionConfig reducedMotion="user">
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

        {/* Filters - chips */}
        <div className="mb-12">
          <div className="flex flex-col gap-6 mb-6">
            <FilterGroup
              label="Condição"
              options={conditionCategories}
              selectedId={condition?.id}
              onSelect={(cat) => setFilter('condicao', cat)}
            />
            <FilterGroup
              label="Modelo"
              options={modelCategories}
              selectedId={model?.id}
              onSelect={(cat) => setFilter('modelo', cat)}
            />
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
        ) : (
          // key muda com os filtros: a lista nova entra com fade de 200ms; min-h evita o layout pular
          <motion.div
            key={`${condition?.id ?? ''}|${model?.id ?? ''}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="min-h-[32rem]"
          >
            {filteredProducts.length > 0 ? (
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
            ) : emptyCategory ? (
              <div className="text-center py-16">
                <p className="text-secondary font-paragraph text-lg mb-6">
                  Ainda não temos {emptyCategory.name.toLowerCase()} disponíveis. Fale com a gente no WhatsApp.
                </p>
                <a
                  href={emptyWhatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center min-h-[3rem] bg-primary text-primary-foreground px-8 py-3 rounded-[6px] font-paragraph font-semibold"
                >
                  Falar no WhatsApp
                </a>
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-secondary font-paragraph text-lg">
                  Nenhum produto encontrado com esses filtros.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </section>

      <Footer />
    </div>
    </MotionConfig>
  );
}
