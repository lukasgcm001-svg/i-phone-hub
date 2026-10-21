import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

export default function LojaPage() {
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

        {/* Placeholder para galeria do Wix Stores */}
        <div className="bg-surface border border-line rounded-lg p-16 md:p-24 text-center min-h-[400px] flex items-center justify-center">
          <div>
            <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-secondary font-paragraph text-lg mb-2">
              Galeria de Produtos
            </p>
            <p className="text-secondary/70 font-paragraph text-sm">
              Esta seção será conectada ao Wix Stores
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
