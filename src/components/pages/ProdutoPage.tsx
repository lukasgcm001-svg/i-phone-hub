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
import { convertWixImageUrl, getMinProductPrice, capitalizeFirstLetter } from '@/lib/wix-image-utils';

interface ProductVariant {
  _id: string;
  name?: string;
  actualPriceRange?: {
    minValue?: {
      amount?: string | number;
    };
  };
  price?: {
    actualPrice?: {
      amount?: string | number;
    };
  };
  productData?: {
    productId?: string;
  };
  optionChoices?: Array<{
    choiceId?: string;
  }>;
  media?: {
    image?: string;
  };
  options?: Array<{
    optionName?: string;
    selection?: string;
  }>;
}

interface OptionChoice {
  choiceId?: string;
  description?: string;
  colorCode?: string;
  linkedMedia?: {
    image?: string;
  };
}

interface ProductOption {
  optionName?: string;
  choicesSettings?: {
    choices?: OptionChoice[];
  };
}

interface InfoSection {
  title?: string;
  description?: string;
}

interface Product {
  _id: string;
  name: string;
  plainDescription?: string;
  description?: string;
  actualPriceRange?: {
    minValue?: {
      amount?: string | number;
    };
  };
  media?: {
    main?: {
      image?: string;
    };
    itemsInfo?: Array<{
      image?: string;
    }>;
  };
  options?: ProductOption[];
  infoSections?: InfoSection[];
  productType?: string;
  variantSummary?: {
    variantCount?: number;
  };
}

export default function ProdutoPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [mainImage, setMainImage] = useState<string>('');

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setIsLoading(true);
        if (!id) return;

        // Fetch product
        const productData = await BaseCrudService.getById<Product>('StoreCatalog/Products', id);

        if (productData) {
          setProduct(productData);

          // Get main image from media.main.image
          const mainImageUrl = productData.media?.main?.image;
          const convertedMainImage = convertWixImageUrl(mainImageUrl);
          setMainImage(convertedMainImage || '');

          // Fetch variants using the product ID
          try {
            const variantsResult = await BaseCrudService.getAll<ProductVariant>(
              'StoreCatalog/Variants',
              {},
              { limit: 100 }
            );

            // Filter variants that belong to this product by matching productData.productId
            if (variantsResult.items) {
              const filteredVariants = variantsResult.items.filter(
                variant => variant.productData?.productId === id
              );
              setVariants(filteredVariants);
            }
          } catch (err) {
            console.error('Error loading variants:', err);
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

  // Update price when options change
  useEffect(() => {
    if (!product || variants.length === 0) return;

    // Find matching variant based on selected options
    let matchingVariant: ProductVariant | null = null;

    // Get the selected color and storage choiceIds
    const colorOption = product.options?.find(opt => opt.optionName === 'Cor');
    const storageOption = product.options?.find(opt => opt.optionName === 'Armazenamento');

    const selectedColorName = selectedOptions['Cor'];
    const selectedStorageName = selectedOptions['Armazenamento'];

    // Get choiceIds for selected options
    const selectedColorChoiceId = colorOption?.choicesSettings?.choices?.find(
      c => c.description === selectedColorName
    )?.choiceId;
    const selectedStorageChoiceId = storageOption?.choicesSettings?.choices?.find(
      c => c.description === selectedStorageName
    )?.choiceId;

    // Find variant with matching optionChoices
    if (selectedColorChoiceId && selectedStorageChoiceId) {
      matchingVariant = variants.find(variant => {
        if (!variant.optionChoices || variant.optionChoices.length < 2) return false;
        const choiceIds = variant.optionChoices.map(oc => oc.choiceId);
        return (
          choiceIds.includes(selectedColorChoiceId) &&
          choiceIds.includes(selectedStorageChoiceId)
        );
      }) || null;
    }

    // Update main image if variant has media
    if (matchingVariant?.media?.image) {
      const convertedImage = convertWixImageUrl(matchingVariant.media.image);
      if (convertedImage) {
        setMainImage(convertedImage);
      }
    }
  }, [selectedOptions, variants, product]);

  // Handle color selection with linkedMedia
  const handleColorChange = (colorChoice: OptionChoice) => {
    const colorName = colorChoice.description || '';
    setSelectedOptions(prev => ({
      ...prev,
      'Cor': colorName
    }));

    // Update main image if linkedMedia exists
    if (colorChoice.linkedMedia?.image) {
      const convertedImage = convertWixImageUrl(colorChoice.linkedMedia.image);
      if (convertedImage) {
        setMainImage(convertedImage);
      }
    }
  };

  const formatPrice = (price: number): string => {
    if (price === 0) return '';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const getSelectedVariantPrice = (): number => {
    if (!product || variants.length === 0) {
      return getMinProductPrice(product);
    }

    const colorOption = product.options?.find(opt => opt.optionName === 'Cor');
    const storageOption = product.options?.find(opt => opt.optionName === 'Armazenamento');

    const selectedColorName = selectedOptions['Cor'];
    const selectedStorageName = selectedOptions['Armazenamento'];

    const selectedColorChoiceId = colorOption?.choicesSettings?.choices?.find(
      c => c.description === selectedColorName
    )?.choiceId;
    const selectedStorageChoiceId = storageOption?.choicesSettings?.choices?.find(
      c => c.description === selectedStorageName
    )?.choiceId;

    if (selectedColorChoiceId && selectedStorageChoiceId) {
      const matchingVariant = variants.find(variant => {
        if (!variant.optionChoices || variant.optionChoices.length < 2) return false;
        const choiceIds = variant.optionChoices.map(oc => oc.choiceId);
        return (
          choiceIds.includes(selectedColorChoiceId) &&
          choiceIds.includes(selectedStorageChoiceId)
        );
      });

      if (matchingVariant?.price?.actualPrice?.amount) {
        const priceString = matchingVariant.price.actualPrice.amount;
        const amount = typeof priceString === 'string' ? parseInt(priceString, 10) : priceString;
        if (amount && amount > 0) {
          return amount;
        }
      }
    }

    return getMinProductPrice(product);
  };

  const getMinPrice = (): number => {
    if (!product || variants.length === 0) {
      return getMinProductPrice(product);
    }

    const prices = variants
      .map(v => {
        if (v.price?.actualPrice?.amount) {
          const priceString = v.price.actualPrice.amount;
          const amount = typeof priceString === 'string' ? parseInt(priceString, 10) : priceString;
          return amount || 0;
        }
        return 0;
      })
      .filter(p => p > 0);

    return prices.length > 0 ? Math.min(...prices) : getMinProductPrice(product);
  };

  const getProductImages = (): string[] => {
    const images: string[] = [];

    // Add main image first
    if (mainImage) {
      images.push(mainImage);
    }

    // Add images from media.itemsInfo
    if (product?.media?.itemsInfo && Array.isArray(product.media.itemsInfo)) {
      for (const item of product.media.itemsInfo) {
        if (item.image) {
          const convertedUrl = convertWixImageUrl(item.image);
          if (convertedUrl && !images.includes(convertedUrl)) {
            images.push(convertedUrl);
          }
        }
      }
    }

    return images;
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

  const productImages = getProductImages();
  const colorOption = product.options?.find(opt => opt.optionName === 'Cor');
  const storageOption = product.options?.find(opt => opt.optionName === 'Armazenamento');

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
            {productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setMainImage(img)}
                    className={`aspect-square rounded-[4px] overflow-hidden border-2 transition-all ${
                      mainImage === img
                        ? 'border-primary'
                        : 'border-line hover:border-primary/50'
                    }`}
                  >
                    <Image
                      src={img}
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
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
                {product.name}
              </h1>
              <p className="text-3xl font-heading font-bold text-primary">
                a partir de {formatPrice(getMinPrice())}
              </p>
            </div>

            {/* Color Selector */}
            {colorOption?.choicesSettings?.choices && colorOption.choicesSettings.choices.length > 0 ? (
              <div className="mb-8">
                <label className="block text-sm font-paragraph font-semibold text-foreground mb-4">
                  Cor
                </label>
                <div className="flex flex-wrap gap-3">
                  {colorOption.choicesSettings.choices.map(choice => (
                    <button
                      key={choice.choiceId}
                      onClick={() => handleColorChange(choice)}
                      className={`px-6 py-3 rounded-[6px] font-paragraph font-medium transition-all flex items-center gap-2 ${
                        selectedOptions['Cor'] === choice.description
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-surface border border-line text-foreground hover:border-primary'
                      }`}
                    >
                      {choice.colorCode && (
                        <div
                          className="w-4 h-4 rounded-full border border-current"
                          style={{ backgroundColor: choice.colorCode }}
                        />
                      )}
                      {capitalizeFirstLetter(choice.description || '')}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mb-8 p-4 bg-surface border border-line rounded-[6px]">
                <p className="text-secondary font-paragraph">Opções não carregadas</p>
              </div>
            )}

            {/* Storage Selector */}
            {storageOption?.choicesSettings?.choices && storageOption.choicesSettings.choices.length > 0 && (
              <div className="mb-8">
                <label className="block text-sm font-paragraph font-semibold text-foreground mb-4">
                  Armazenamento
                </label>
                <div className="flex flex-wrap gap-3">
                  {storageOption.choicesSettings.choices.map(choice => (
                    <button
                      key={choice.choiceId}
                      onClick={() =>
                        setSelectedOptions(prev => ({
                          ...prev,
                          'Armazenamento': choice.description || ''
                        }))
                      }
                      className={`px-6 py-3 rounded-[6px] font-paragraph font-medium transition-all ${
                        selectedOptions['Armazenamento'] === choice.description
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-surface border border-line text-foreground hover:border-primary'
                      }`}
                    >
                      {choice.description}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {product.plainDescription && (
              <div className="mb-8 pb-8 border-b border-line">
                <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
                  Descrição
                </h3>
                <div 
                  className="text-secondary font-paragraph leading-relaxed prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: product.plainDescription.replace(/<[^>]*>/g, '') }}
                />
              </div>
            )}

            {/* Info Sections from Product Data */}
            {product.infoSections && product.infoSections.length > 0 && (
              <div className="space-y-6 mb-12">
                {product.infoSections.map((section, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-heading font-semibold text-foreground mb-1">
                        {section.title}
                      </h4>
                      <p className="text-secondary font-paragraph text-sm">
                        {section.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => {
                  const selectedColor = selectedOptions['Cor'];
                  const selectedStorage = selectedOptions['Armazenamento'];
                  const price = getSelectedVariantPrice();

                  if (!selectedColor || !selectedStorage) {
                    alert('Por favor, selecione a cor e o armazenamento');
                    return;
                  }

                  const message = `Olá! Tenho interesse no ${product.name}, cor ${selectedColor}, ${selectedStorage}, por ${formatPrice(price)}.`;
                  const encodedMessage = encodeURIComponent(message);
                  window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
                }}
                disabled={!selectedOptions['Cor'] || !selectedOptions['Armazenamento']}
                className={`flex-1 inline-flex items-center justify-center px-8 py-4 rounded-[6px] font-paragraph font-semibold transition-all ${
                  selectedOptions['Cor'] && selectedOptions['Armazenamento']
                    ? 'bg-primary text-primary-foreground hover:scale-[1.02] active:scale-[0.98] cursor-pointer'
                    : 'bg-surface border border-line text-secondary cursor-not-allowed opacity-50'
                }`}
              >
                Comprar via WhatsApp
              </button>
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
