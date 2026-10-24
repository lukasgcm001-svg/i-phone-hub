import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Shield, Headphones, Award, ChevronDown, ArrowRight, Smartphone } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { Image } from '@/components/ui/image';
import { BaseCrudService } from '@/integrations';
import { convertWixImageUrl, getMinProductPrice, convertAndFormatPrice } from '@/lib/wix-image-utils';
import { categories } from '@wix/categories';

// --- Constants ---
const FEATURED_CATEGORY_ID = 'a7f817f7-8ac1-43b2-91c3-9072a41ad0fa';

// --- Types ---
interface FAQ {
  question: string;
  answer: string;
}

interface Step {
  num: string;
  title: string;
  desc: string;
}

interface Feature {
  icon: React.ElementType;
  title: string;
  desc: string;
}

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
  variants?: Array<{
    _id: string;
    price?: number;
    priceData?: { price: number };
  }>;
}

export default function HomePage() {
  // --- Canonical Data Sources ---
  const whatsappNumber = '5535999999999';
  const whatsappMessage = encodeURIComponent('Olá, vim pelo site e quero saber sobre um iPhone.');

  const faqs: FAQ[] = [
    {
      question: 'Os iPhones são originais?',
      answer: 'Sim, todos os nossos iPhones são originais Apple, com procedência garantida e nota fiscal.'
    },
    {
      question: 'Qual a diferença entre novo e seminovo?',
      answer: 'Novos são lacrados de fábrica. Seminovos passam por rigorosa inspeção técnica e têm garantia.'
    },
    {
      question: 'Como funciona a garantia?',
      answer: 'Oferecemos garantia de 90 dias para seminovos e 1 ano para novos, além da garantia Apple.'
    },
    {
      question: 'Quanto tempo leva a entrega?',
      answer: 'Entregamos em todo o Brasil. O prazo varia conforme sua região, geralmente de 3 a 10 dias úteis.'
    },
    {
      question: 'Posso parcelar a compra?',
      answer: 'Sim, trabalhamos com diversas formas de pagamento e parcelamento. Consulte as opções pelo WhatsApp.'
    }
  ];

  const steps: Step[] = [
    { num: '01', title: 'Escolha o modelo', desc: 'Navegue pelo catálogo e encontre o iPhone ideal para você.' },
    { num: '02', title: 'Chame no WhatsApp', desc: 'Entre em contato direto conosco para tirar dúvidas e confirmar disponibilidade.' },
    { num: '03', title: 'Receba seu iPhone', desc: 'Finalize o pagamento e receba em casa com segurança e rapidez.' }
  ];

  const features: Feature[] = [
    {
      icon: Shield,
      title: 'Garantia Estendida',
      desc: 'Todos os produtos com garantia e suporte técnico completo.'
    },
    {
      icon: Award,
      title: 'Procedência Certificada',
      desc: 'iPhones originais Apple com nota fiscal e rastreabilidade.'
    },
    {
      icon: Headphones,
      title: 'Atendimento Humano',
      desc: 'Suporte direto pelo WhatsApp, sem robôs ou espera.'
    }
  ];

  // --- Animation & Scroll Hooks ---
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroImageY = useTransform(scrollYProgress, [0, 0.2], ["0%", "15%"]);
  const heroTextY = useTransform(scrollYProgress, [0, 0.2], ["0%", "5%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  return (
    <div ref={containerRef} className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <style>{`
        .tech-grid {
          background-image: 
            linear-gradient(to right, rgba(35, 40, 50, 0.3) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(35, 40, 50, 0.3) 1px, transparent 1px);
          background-size: 4rem 4rem;
        }
        .clip-diagonal {
          clip-path: polygon(0 0, 100% 0, 100% calc(100% - 2rem), calc(100% - 2rem) 100%, 0 100%);
        }
        .text-gradient {
          background: linear-gradient(180deg, #F4F6F8 0%, #8B93A1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>

      <Header />
      <WhatsAppButton />

      {/* Global Scroll Progress */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-[2px] bg-primary z-50 origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[95vh] flex items-center pt-32 pb-20 overflow-clip border-b border-line">
        {/* Architectural Background Elements */}
        <div className="absolute inset-0 tech-grid pointer-events-none opacity-50" />
        <div className="absolute left-6 md:left-12 top-0 bottom-0 w-px bg-line pointer-events-none" />
        <div className="absolute right-6 md:right-12 top-0 bottom-0 w-px bg-line pointer-events-none" />
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-line/30 pointer-events-none hidden lg:block" />

        <div className="w-full max-w-[120rem] mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-12 gap-8 lg:gap-16 items-center">
            
            {/* Hero Text Content */}
            <motion.div 
              style={{ y: heroTextY, opacity: heroOpacity }}
              className="col-span-12 lg:col-span-7 flex flex-col"
            >
              <div className="flex items-center gap-4 mb-8">
                <span className="w-8 h-px bg-primary"></span>
                <p className="text-xs uppercase tracking-[0.2em] text-primary font-paragraph font-medium">
                  Tecnologia Premium
                </p>
              </div>
              
              <h1 className="text-5xl md:text-7xl lg:text-[6.5rem] font-heading font-bold text-foreground mb-8 leading-[1.05] tracking-tight">
                iPhone Original
                <br />
                <span className="text-gradient">Direto pra Você.</span>
              </h1>
              
              <p className="text-lg md:text-xl text-secondary max-w-2xl mb-12 font-paragraph leading-relaxed border-l border-line pl-6">
                Novos e seminovos com garantia, procedência certificada e atendimento humano. A experiência Apple sem complicação.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <Link
                  to="/loja"
                  className="group relative inline-flex items-center justify-center bg-primary text-primary-foreground px-8 py-4 rounded-[6px] font-semibold font-paragraph overflow-hidden transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Ver Catálogo <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                </Link>
                
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center bg-transparent text-foreground border border-line px-8 py-4 rounded-[6px] font-semibold font-paragraph transition-all duration-300 hover:border-primary hover:text-primary"
                >
                  <span className="flex items-center gap-2">
                    Falar no WhatsApp
                  </span>
                </a>
              </div>
            </motion.div>

            {/* Hero Image / Visual Anchor */}
            <div className="col-span-12 lg:col-span-5 relative h-[50vh] lg:h-[75vh] mt-12 lg:mt-0">
              <motion.div 
                style={{ y: heroImageY }}
                className="absolute inset-0 w-full h-full clip-diagonal bg-surface border border-line p-2"
              >
                <div className="relative w-full h-full rounded-[4px] overflow-hidden bg-background">
                  <Image 
                    src="https://static.wixstatic.com/media/199aa8_39f7dc9ef36c4704887efeadde415efb~mv2.png?originWidth=896&originHeight=640" 
                    alt="iPhone Premium Showcase"
                    className="w-full h-full object-cover opacity-80 mix-blend-luminosity hover:mix-blend-normal transition-all duration-700"
                  />
                  {/* Overlay UI Elements */}
                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                    <div className="bg-surface/80 backdrop-blur-md border border-line p-4 rounded-[6px]">
                      <p className="text-xs uppercase tracking-wider text-secondary font-paragraph mb-1">Status</p>
                      <p className="text-sm font-heading font-semibold text-primary flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                        Estoque Atualizado
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* --- COMO COMPRAR (Sticky Narrative) --- */}
      <section className="relative w-full bg-background py-32 border-b border-line">
        <div className="max-w-[120rem] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-12 gap-12 lg:gap-24">
            
            {/* Sticky Header */}
            <div className="col-span-12 lg:col-span-5">
              <div className="sticky top-32">
                <div className="flex items-center gap-4 mb-6">
                  <span className="w-8 h-px bg-primary"></span>
                  <p className="text-xs uppercase tracking-[0.2em] text-secondary font-paragraph">
                    Processo Simples
                  </p>
                </div>
                <h2 className="text-4xl md:text-6xl font-heading font-bold text-foreground mb-6 leading-tight">
                  Jornada de <br/><span className="text-secondary">Aquisição.</span>
                </h2>
                <p className="text-lg text-secondary font-paragraph max-w-md">
                  Desenhamos um processo transparente e direto para você ter seu novo iPhone em mãos com total segurança.
                </p>
              </div>
            </div>

            {/* Scrolling Steps */}
            <div className="col-span-12 lg:col-span-7 relative">
              {/* Vertical connecting line */}
              <div className="absolute left-[2.25rem] top-8 bottom-8 w-px bg-line hidden md:block" />
              
              <div className="space-y-16 md:space-y-24">
                {steps.map((step, index) => (
                  <motion.div
                    key={step.num}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="relative flex flex-col md:flex-row gap-6 md:gap-12 group"
                  >
                    {/* Number Indicator */}
                    <div className="relative z-10 flex-shrink-0 w-20 h-20 bg-surface border border-line rounded-[6px] flex items-center justify-center group-hover:border-primary transition-colors duration-300">
                      <span className="text-2xl font-heading font-bold text-foreground group-hover:text-primary transition-colors">
                        {step.num}
                      </span>
                    </div>
                    
                    {/* Content */}
                    <div className="pt-2">
                      <h3 className="text-2xl md:text-3xl font-heading font-semibold text-foreground mb-4">
                        {step.title}
                      </h3>
                      <p className="text-secondary font-paragraph leading-relaxed text-lg max-w-lg">
                        {step.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- DESTAQUES (Products from Wix Stores) --- */}
      <section className="relative w-full bg-surface py-32 border-b border-line overflow-hidden">
        <div className="absolute inset-0 tech-grid opacity-30 pointer-events-none" />
        
        <div className="max-w-[120rem] mx-auto px-6 md:px-12 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <span className="w-8 h-px bg-primary"></span>
                <p className="text-xs uppercase tracking-[0.2em] text-secondary font-paragraph">
                  Catálogo
                </p>
              </div>
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground">
                Destaques da Loja
              </h2>
            </div>
            <Link to="/loja" className="text-sm font-paragraph font-medium text-primary hover:underline flex items-center gap-2">
              Ver todos os modelos <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Products Grid */}
          <FeaturedProducts />
        </div>
      </section>

      {/* --- DIFERENCIAIS (Asymmetrical Grid) --- */}
      <section className="relative w-full bg-background py-32 border-b border-line">
        <div className="max-w-[120rem] mx-auto px-6 md:px-12">
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-4">
              <span className="w-8 h-px bg-primary"></span>
              <p className="text-xs uppercase tracking-[0.2em] text-secondary font-paragraph">
                Por Que Escolher
              </p>
            </div>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground">
              Nossos Diferenciais
            </h2>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* Featured Large Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="col-span-12 lg:col-span-7 bg-surface border border-line rounded-[6px] p-10 md:p-16 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors duration-500" />
              
              <div className="w-16 h-16 bg-background border border-line rounded-[6px] flex items-center justify-center mb-8 relative z-10">
                {React.createElement(features[0].icon, { className: "w-8 h-8 text-primary" })}
              </div>
              <h3 className="text-3xl font-heading font-bold text-foreground mb-4 relative z-10">
                {features[0].title}
              </h3>
              <p className="text-secondary font-paragraph text-lg leading-relaxed max-w-md relative z-10">
                {features[0].desc}
              </p>
            </motion.div>

            {/* Stacked Smaller Cards */}
            <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
              {features.slice(1).map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: (index + 1) * 0.1 }}
                  className="flex-1 bg-surface border border-line rounded-[6px] p-8 md:p-10 flex flex-col justify-center group hover:border-line/80 transition-colors"
                >
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 bg-background border border-line rounded-[6px] flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-6 h-6 text-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div>
                      <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
                        {item.title}
                      </h3>
                      <p className="text-secondary font-paragraph leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- FAQ (Minimalist Accordion) --- */}
      <section className="relative w-full bg-surface py-32 border-b border-line">
        <div className="max-w-[120rem] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-12 gap-12 lg:gap-24">
            
            <div className="col-span-12 lg:col-span-4">
              <div className="sticky top-32">
                <div className="flex items-center gap-4 mb-4">
                  <span className="w-8 h-px bg-primary"></span>
                  <p className="text-xs uppercase tracking-[0.2em] text-secondary font-paragraph">
                    Base de Conhecimento
                  </p>
                </div>
                <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
                  Perguntas e Respostas
                </h2>
                <p className="text-secondary font-paragraph">
                  Informações claras e diretas sobre nossos produtos, garantias e processos de envio.
                </p>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-8">
              <div className="border-t border-line">
                {faqs.map((faq, index) => (
                  <FAQItem key={index} faq={faq} index={index} />
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- CTA FINAL (Immersive Full Bleed) --- */}
      <section className="relative w-full py-32 md:py-48 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://static.wixstatic.com/media/199aa8_99c18d00013642b6a33fd1be2824e9e7~mv2.png?originWidth=1152&originHeight=576" 
            alt="Background Texture"
            className="w-full h-full object-cover opacity-20 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>

        <div className="max-w-[100rem] mx-auto px-6 md:px-12 relative z-10 text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-4xl"
          >
            <div className="inline-flex items-center gap-4 mb-8">
              <span className="w-12 h-px bg-primary"></span>
              <p className="text-xs uppercase tracking-[0.2em] text-primary font-paragraph font-medium">
                Pronto para Começar?
              </p>
              <span className="w-12 h-px bg-primary"></span>
            </div>
            
            <h2 className="text-5xl md:text-7xl font-heading font-bold text-foreground mb-8 leading-tight">
              Encontre Seu <br/>iPhone Ideal.
            </h2>
            
            <p className="text-xl text-secondary max-w-2xl mx-auto mb-12 font-paragraph">
              Atendimento rápido, produtos certificados e entrega em todo o Brasil. Fale com um especialista agora.
            </p>
            
            <a
              href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center justify-center bg-primary text-primary-foreground px-10 py-5 rounded-[6px] font-bold font-paragraph text-lg overflow-hidden transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="relative z-10 flex items-center gap-3">
                Falar com Especialista <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function FAQItem({ faq, index }: { faq: FAQ; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="border-b border-line"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-8 text-left group focus:outline-none"
      >
        <span className="text-xl font-heading font-semibold text-foreground group-hover:text-primary transition-colors pr-8">
          {faq.question}
        </span>
        <span className={`flex-shrink-0 w-10 h-10 border border-line rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-primary border-primary text-primary-foreground rotate-180' : 'text-secondary group-hover:border-primary group-hover:text-primary'}`}>
          <ChevronDown className="w-5 h-5" />
        </span>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-8 pr-12 text-secondary font-paragraph text-lg leading-relaxed">
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        
        // Get items in the Featured category using Wix Categories API
        const categoryItems = await categories.listItemsInCategory(
          FEATURED_CATEGORY_ID,
          { appNamespace: '@wix/stores' }
        );
        
        console.log('Raw listItemsInCategory result:', categoryItems);
        
        // Extract catalogItemIds from the response
        const featuredItemIds = (categoryItems.items || []).map((item: any) => item.catalogItemId);
        
        if (featuredItemIds.length === 0) {
          setProducts([]);
          return;
        }
        
        // Fetch products from StoreCatalog/Products and filter by the featured item IDs
        const result = await BaseCrudService.getAll<Product>('StoreCatalog/Products', {}, { limit: 4 });
        
        const featuredProducts = (result.items || [])
          .filter((product) => featuredItemIds.includes(product._id))
          .slice(0, 4);
        
        setProducts(featuredProducts);
      } catch (error) {
        console.error('Error loading featured products:', error);
        console.log('Full error object:', error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

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

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-background border border-line rounded-[6px] p-6 animate-pulse">
            <div className="w-full h-48 bg-line rounded-[4px] mb-4" />
            <div className="h-6 bg-line rounded mb-2" />
            <div className="h-4 bg-line rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <motion.div
          key={product._id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="group bg-background border border-line rounded-[6px] overflow-hidden hover:border-primary transition-all duration-300"
        >
          {/* Product Image */}
          <div className="relative w-full h-48 bg-surface overflow-hidden">
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
          <div className="p-4">
            <h3 className="text-base font-heading font-semibold text-foreground mb-2 line-clamp-2">
              {product.name}
            </h3>
            
            {getMinPrice(product) > 0 && (
              <p className="text-sm text-secondary font-paragraph mb-4">
                a partir de <span className="text-primary font-semibold">{formatPrice(getMinPrice(product))}</span>
              </p>
            )}

            <Link
              to={`/produto/${product._id}`}
              className="w-full inline-flex items-center justify-center bg-primary text-primary-foreground px-4 py-2 rounded-[6px] font-paragraph font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Ver Detalhes
            </Link>
          </div>
        </motion.div>
      ))}
    </div>
  );
}