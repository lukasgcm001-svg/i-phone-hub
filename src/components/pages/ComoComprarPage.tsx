import { motion } from 'framer-motion';
import { Search, MessageSquare, Package, CreditCard, Truck, CheckCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

export default function ComoComprarPage() {
  const whatsappNumber = '5535999999999';
  const whatsappMessage = encodeURIComponent('Olá, vim pelo site e quero saber sobre um iPhone.');

  const steps = [
    {
      icon: Search,
      title: 'Escolha seu iPhone',
      description: 'Navegue pelo nosso catálogo e encontre o modelo ideal. Veja especificações, condições e preços de cada aparelho.'
    },
    {
      icon: MessageSquare,
      title: 'Entre em contato',
      description: 'Chame no WhatsApp para tirar dúvidas, confirmar disponibilidade e receber atendimento personalizado de nossa equipe.'
    },
    {
      icon: CreditCard,
      title: 'Escolha a forma de pagamento',
      description: 'Oferecemos diversas opções de pagamento e parcelamento. Nossa equipe vai te orientar sobre a melhor escolha para você.'
    },
    {
      icon: Package,
      title: 'Preparamos seu pedido',
      description: 'Após a confirmação do pagamento, preparamos seu iPhone com todo cuidado e embalagem segura para o envio.'
    },
    {
      icon: Truck,
      title: 'Acompanhe a entrega',
      description: 'Você recebe o código de rastreamento para acompanhar seu pedido em tempo real até chegar na sua casa.'
    },
    {
      icon: CheckCircle,
      title: 'Receba e aproveite',
      description: 'Seu iPhone chega com nota fiscal, garantia ativa e todo suporte necessário. É só desembalar e começar a usar.'
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <WhatsAppButton />

      {/* Hero */}
      <section className="w-full max-w-[100rem] mx-auto px-6 md:px-12 pt-32 pb-20 md:pt-40 md:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs uppercase tracking-wider text-secondary mb-4 font-paragraph">
            Processo Transparente
          </p>
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-foreground mb-6">
            Como <span className="text-primary">Comprar</span>
          </h1>
          <p className="text-lg text-secondary max-w-3xl font-paragraph">
            Um processo simples, seguro e transparente do início ao fim. Veja como é fácil ter seu iPhone.
          </p>
        </motion.div>
      </section>

      {/* Steps */}
      <section className="w-full bg-surface py-20 md:py-32">
        <div className="max-w-[100rem] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-background border border-line rounded-lg p-8"
              >
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center">
                      <step.icon className="w-7 h-7 text-primary" />
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-secondary font-paragraph mb-2">
                      Passo {String(index + 1).padStart(2, '0')}
                    </div>
                    <h3 className="text-xl font-heading font-semibold text-foreground mb-3">
                      {step.title}
                    </h3>
                    <p className="text-secondary font-paragraph leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full max-w-[100rem] mx-auto px-6 md:px-12 py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-surface border border-line rounded-lg p-12 md:p-16 text-center"
        >
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-6">
            Pronto para Começar?
          </h2>
          <p className="text-lg text-secondary max-w-2xl mx-auto mb-8 font-paragraph">
            Nossa equipe está pronta para te atender e tirar todas as suas dúvidas.
          </p>
          <a
            href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-primary text-primary-foreground px-8 py-4 rounded-md font-semibold font-paragraph transition-all duration-300 hover:opacity-90"
          >
            Falar no WhatsApp
          </a>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
