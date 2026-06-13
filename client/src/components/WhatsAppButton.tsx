import { MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface WhatsAppButtonProps {
  message?: string;
  phoneNumber?: string;
}

export default function WhatsAppButton({ 
  message = "Hello! I'm interested in FIFA World Cup tickets. Could you please provide availability and pricing information?",
  phoneNumber = "1234567890" // Replace with actual WhatsApp number
}: WhatsAppButtonProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      {/* Close button */}
      <button
        onClick={() => setIsVisible(false)}
        className="text-gray-500 hover:text-gray-700 text-sm"
        aria-label="Close WhatsApp button"
      >
        ✕
      </button>

      {/* WhatsApp button */}
      <button
        onClick={handleClick}
        className="flex items-center justify-center w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95"
        aria-label="Contact us on WhatsApp"
        title="Contact us on WhatsApp"
      >
        <MessageCircle size={24} />
      </button>

      {/* Tooltip */}
      <div className="bg-gray-800 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-lg opacity-0 hover:opacity-100 transition-opacity duration-200">
        Chat with us on WhatsApp
      </div>
    </div>
  );
}
