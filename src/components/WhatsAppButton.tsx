import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

// Constante com número do WhatsApp (apenas dígitos com DDD)
const WHATSAPP_NUMBER = '';

export default function WhatsAppButton() {
  const whatsappMessage = encodeURIComponent('Olá, vim pelo site e quero saber sobre um iPhone.');

  if (!WHATSAPP_NUMBER) {
    return null;
  }

  return (
    <motion.a
      href={`https://wa.me/55${WHATSAPP_NUMBER}?text=${whatsappMessage}`}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.5, type: 'spring', stiffness: 260, damping: 20 }}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300"
      aria-label="Falar no WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
    </motion.a>
  );
}
