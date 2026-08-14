const faqs = [
  {
    q: 'What is your return policy?',
    a: 'We offer a 30-day return policy for most items. Please check our shipping & returns page for details.',
  },
  {
    q: 'How long does shipping take?',
    a: 'Standard shipping usually takes 5–7 business days. Express options are available at checkout.',
  },
  {
    q: 'Do you ship internationally?',
    a: 'Yes, we ship to over 50 countries. International shipping times and costs vary.',
  },
];

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-6 text-3xl font-bold">Frequently Asked Questions</h1>
      <div className="space-y-6">
        {faqs.map((faq, idx) => (
          <div key={idx} className="border-b pb-4">
            <h2 className="text-xl font-semibold">{faq.q}</h2>
            <p className="mt-2 text-gray-700">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}