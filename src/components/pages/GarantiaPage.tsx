import { motion } from 'framer-motion';
import { Shield, FileCheck, Globe, Award } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

export default function GarantiaPage() {
  const garantias = [
    {
      icon: Shield,
      title: 'Garantia Estendida',
      items: [
        'iPhones novos: 1 ano de garantia Apple + nossa garantia adicional',
        'iPhones seminovos: 90 dias de garantia contra defeitos de fabricação',
        'Suporte técnico completo durante todo período de garantia',
        'Troca imediata em caso de defeito comprovado'
      ]
    },
    {
      icon: FileCheck,
      title: 'Procedência Certificada',
      items: [
        'Todos os iPhones são originais Apple',
        'Nota fiscal em todas as vendas',
        'Verificação de IMEI e histórico do aparelho',
        'Certificado de autenticidade quando aplicável'
      ]
    },
    {
      icon: Globe,
      title: 'Origem dos Produtos',
      items: [
        'iPhones novos: importados diretamente ou de distribuidores autorizados',
        'iPhones seminovos: rigorosa inspeção técnica de 30 pontos',
        'Rastreabilidade completa de cada aparelho',
        'Parceria com fornecedores certificados'
      ]
    },
    {
      icon: Award,
      title: 'Compromisso de Qualidade',
      items: [
        'Inspeção técnica antes do envio',
        'Embalagem segura e lacrada',
        'Acessórios originais ou compatíveis de qualidade',
        'Satisfação garantida ou seu dinheiro de volta em 7 dias'
      ]
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
            Segurança e Confiança
          </p>
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-foreground mb-6">
            Garantia e <span className="text-primary">Procedência</span>
          </h1>
          <p className="text-lg text-secondary max-w-3xl font-paragraph">
            Transparência total sobre a origem dos nossos produtos e as garantias que oferecemos.
          </p>
        </motion.div>
      </section>

      {/* Garantias */}
      <section className="w-full bg-surface py-20 md:py-32">
        <div className="max-w-[100rem] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {garantias.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-background border border-line rounded-lg p-8"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-2xl font-heading font-semibold text-foreground mb-6">
                  {item.title}
                </h3>
                <ul className="space-y-3">
                  {item.items.map((listItem, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span className="text-secondary font-paragraph leading-relaxed">
                        {listItem}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Processo de Inspeção */}
      <section className="w-full max-w-[100rem] mx-auto px-6 md:px-12 py-20 md:py-32">
        <div className="grid grid-cols-12 gap-12">
          <div className="col-span-12 lg:col-span-5">
            <p className="text-xs uppercase tracking-wider text-secondary mb-4 font-paragraph">
              Controle de Qualidade
            </p>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
              Inspeção Técnica Rigorosa
            </h2>
            <p className="text-secondary font-paragraph leading-relaxed mb-8">
              Cada iPhone seminovo passa por um processo detalhado de verificação antes de ser disponibilizado para venda.
            </p>
          </div>

          <div className="col-span-12 lg:col-span-7">
            <div className="bg-surface border border-line rounded-lg p-8 space-y-6">
              {[
                'Verificação de autenticidade e IMEI',
                'Teste completo de hardware (tela, câmeras, sensores)',
                'Análise de bateria e capacidade de carga',
                'Verificação de Face ID / Touch ID',
                'Teste de conectividade (Wi-Fi, Bluetooth, celular)',
                'Limpeza profissional e higienização',
                'Atualização para última versão do iOS',
                'Embalagem e preparação para envio'
              ].map((step, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-heading font-bold text-sm">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <p className="text-foreground font-paragraph">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full bg-surface py-20 md:py-32">
        <div className="max-w-[100rem] mx-auto px-6 md:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-6">
              Ainda tem dúvidas?
            </h2>
            <p className="text-lg text-secondary max-w-2xl mx-auto mb-8 font-paragraph">
              Nossa equipe está pronta para esclarecer qualquer questão sobre garantia e procedência.
            </p>
            <a
              href={`https://wa.me/[NÚMERO DO WHATSAPP]?text=${encodeURIComponent('Olá, vim pelo site e quero saber sobre um iPhone.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-primary text-primary-foreground px-8 py-4 rounded-md font-semibold font-paragraph transition-all duration-300 hover:opacity-90"
            >
              Falar com Especialista
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
