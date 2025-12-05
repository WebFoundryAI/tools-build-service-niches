import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BRAND } from "@/config/brand";

const faqs = [
  {
    question: "How quickly can you respond to an emergency?",
    answer: `We aim to respond to emergency callouts within 1-2 hours across ${BRAND.serviceAreaLabel}. Our 24/7 service means we're available whenever you need us.`,
  },
  {
    question: "Do you charge a call-out fee?",
    answer: "No, we don't charge any call-out fees. You only pay for the work that's carried out, and we always provide a quote before starting any job.",
  },
  {
    question: "Are your prices fixed?",
    answer: "Yes, we provide fixed-price quotes with no hidden charges. Once we've assessed the problem, the price we quote is the price you pay.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept cash, card payments, and bank transfers. Payment is typically taken upon completion of the work.",
  },
  {
    question: "Do you offer CCTV drain surveys?",
    answer: "Yes, we offer comprehensive CCTV drain surveys using the latest equipment. This allows us to accurately diagnose problems and provide you with a detailed report.",
  },
];

interface FAQSectionProps {
  showAll?: boolean;
}

export function FAQSection({ showAll = false }: FAQSectionProps) {
  const displayFaqs = showAll ? faqs : faqs.slice(0, 4);

  return (
    <section className="section-padding">
      <div className="container-narrow px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Got questions? We've got answers. If you can't find what you're looking for, give us a call.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {displayFaqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left font-semibold">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
