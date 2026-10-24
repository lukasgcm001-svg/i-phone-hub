import { motion } from 'framer-motion';
import { MessageCircle, Clock, Instagram, Facebook, Mail } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

export default function ContatoPage() {
  const whatsappNumber = '5531973418394';
  const whatsappMessage = encodeURIComponent('Olá, vim pelo site e quero saber sobre um iPhone.');

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
            Fale Conosco
          </p>
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-foreground mb-6">
            Entre em <span className="text-primary">Contato</span>
          </h1>
          <p className="text-lg text-secondary max-w-3xl font-paragraph">
            Estamos prontos para atender você. Escolha o canal de sua preferência.
          </p>
        </motion.div>
      </section>

      {/* Contact Cards */}
      <section className="w-full bg-surface py-20 md:py-32">
        <div className="max-w-[100rem] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* WhatsApp Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-background border border-line rounded-lg p-8 md:p-10"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <MessageCircle className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl font-heading font-semibold text-foreground mb-4">
                WhatsApp
              </h3>
              <p className="text-secondary font-paragraph leading-relaxed mb-6">
                Atendimento direto e rápido. Tire suas dúvidas, consulte disponibilidade e finalize sua compra.
              </p>
              <p className="text-foreground font-paragraph font-semibold mb-6">
                {whatsappNumber}
              </p>
              <a
                href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-primary text-primary-foreground px-6 py-3 rounded-md font-semibold font-paragraph transition-all duration-300 hover:opacity-90"
              >
                Iniciar Conversa
              </a>
            </motion.div>

            {/* Horário Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-background border border-line rounded-lg p-8 md:p-10"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <Clock className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl font-heading font-semibold text-foreground mb-4">
                Horário de Atendimento
              </h3>
              <p className="text-secondary font-paragraph leading-relaxed mb-6">
                Estamos disponíveis nos seguintes horários:
              </p>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-secondary font-paragraph">Segunda a Sexta</span>
                  <span className="text-foreground font-paragraph font-semibold">9h às 18h</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-secondary font-paragraph">Sábado</span>
                  <span className="text-foreground font-paragraph font-semibold">9h às 13h</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-secondary font-paragraph">Domingo</span>
                  <span className="text-foreground font-paragraph font-semibold">Fechado</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Redes Sociais */}
      <section className="w-full max-w-[100rem] mx-auto px-6 md:px-12 py-20 md:py-32">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-wider text-secondary mb-4 font-paragraph">
            Siga-nos
          </p>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
            Redes Sociais
          </h2>
          <p className="text-lg text-secondary max-w-2xl mx-auto font-paragraph">
            Acompanhe nossas novidades, promoções e lançamentos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <motion.a
            href="#"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-surface border border-line rounded-lg p-8 text-center hover:border-primary transition-all group"
          >
            <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
              <Instagram className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
              Instagram
            </h3>
            <p className="text-secondary font-paragraph text-sm">
              @nomedloja
            </p>
          </motion.a>

          <motion.a
            href="#"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-surface border border-line rounded-lg p-8 text-center hover:border-primary transition-all group"
          >
            <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
              <Facebook className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
              Facebook
            </h3>
            <p className="text-secondary font-paragraph text-sm">
              /nomedloja
            </p>
          </motion.a>

          <motion.a
            href="#"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-surface border border-line rounded-lg p-8 text-center hover:border-primary transition-all group"
          >
            <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
              <Mail className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
              Email
            </h3>
            <p className="text-secondary font-paragraph text-sm">
              contato@nomedloja.com
            </p>
          </motion.a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
