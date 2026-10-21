import { Link } from 'react-router-dom';
import { Instagram, Facebook, Mail } from 'lucide-react';

export default function Footer() {
  const whatsappNumber = '[NÚMERO DO WHATSAPP]';

  return (
    <footer className="w-full bg-surface border-t border-line">
      <div className="max-w-[100rem] mx-auto px-6 md:px-12 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-4">
            <h3 className="text-2xl font-heading font-bold text-foreground mb-4">
              [NOME DA LOJA]
            </h3>
            <p className="text-secondary font-paragraph leading-relaxed mb-6">
              iPhones originais com garantia, procedência certificada e atendimento humano.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-background border border-line rounded-md flex items-center justify-center text-secondary hover:text-primary hover:border-primary transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-background border border-line rounded-md flex items-center justify-center text-secondary hover:text-primary hover:border-primary transition-all"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-background border border-line rounded-md flex items-center justify-center text-secondary hover:text-primary hover:border-primary transition-all"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="md:col-span-3">
            <h4 className="text-xs uppercase tracking-wider text-secondary mb-6 font-paragraph font-semibold">
              Navegação
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-foreground hover:text-primary transition-colors font-paragraph">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/loja" className="text-foreground hover:text-primary transition-colors font-paragraph">
                  Loja
                </Link>
              </li>
              <li>
                <Link to="/como-comprar" className="text-foreground hover:text-primary transition-colors font-paragraph">
                  Como Comprar
                </Link>
              </li>
              <li>
                <Link to="/garantia" className="text-foreground hover:text-primary transition-colors font-paragraph">
                  Garantia
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div className="md:col-span-5">
            <h4 className="text-xs uppercase tracking-wider text-secondary mb-6 font-paragraph font-semibold">
              Contato
            </h4>
            <ul className="space-y-3">
              <li className="text-foreground font-paragraph">
                <span className="text-secondary">WhatsApp:</span> {whatsappNumber}
              </li>
              <li className="text-foreground font-paragraph">
                <span className="text-secondary">Horário:</span> Seg a Sex, 9h às 18h
              </li>
              <li className="text-foreground font-paragraph">
                <span className="text-secondary">Sábado:</span> 9h às 13h
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-line mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-secondary text-sm font-paragraph">
            © {new Date().getFullYear()} [NOME DA LOJA]. Todos os direitos reservados.
          </p>
          <div className="flex gap-6">
            <Link to="/garantia" className="text-secondary hover:text-primary text-sm font-paragraph transition-colors">
              Política de Garantia
            </Link>
            <Link to="/contato" className="text-secondary hover:text-primary text-sm font-paragraph transition-colors">
              Fale Conosco
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
