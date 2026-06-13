import emailjs from '@emailjs/browser';

const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined;
const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined;
const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined;

export function isEmailJsConfigured() {
  return Boolean(serviceId && templateId && publicKey);
}

export async function sendTicketVerificationEmail(params: {
  toEmail: string;
  ticketCode: string;
  verificationReference: string;
}) {
  if (!serviceId || !templateId || !publicKey) {
    throw new Error('EmailJS is not configured.');
  }

  return emailjs.send(
    serviceId,
    templateId,
    {
      to_email: params.toEmail,
      email: params.toEmail,
      ticket_code: params.ticketCode,
      verification_reference: params.verificationReference,
      subject: 'FIFA Ticket Verification Confirmation',
      message: `Your ticket verification request for ${params.ticketCode} has been received. Reference: ${params.verificationReference}.`,
    },
    {
      publicKey,
    }
  );
}
