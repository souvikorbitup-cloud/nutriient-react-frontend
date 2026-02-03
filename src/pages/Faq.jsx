import FAQSection from "../components/FAQSection";
import useDocumentTitle from "../hooks/useDocumentTitle";
import ContactForm from "../Utils/ContactForm";

const Faq = () => {
  useDocumentTitle("FAQ | Nutriient - Customized Supplements & Diet Regimen");
  return (
    <section className="app-container mx-auto px-4 py-20 pt-42">
      {/* TITLE */}
      <div className="text-center mb-14">
        <h2 className="text-3xl font-bold">FAQ</h2>
        <div className="w-8 h-0.5 bg-primary mx-auto mt-2" />
      </div>

      <div className="grid lg:grid-cols-2 gap-14">
        {/* FAQ LEFT */}
        <FAQSection />

        {/* FORM RIGHT */}
        <div>
          <h3 className="text-3xl font-semibold mb-2">Questions</h3>
          <p className="text-md text-[#666] mb-6 uppercase tracking-wide">
            We're here to help
          </p>

          <ContactForm />
        </div>
      </div>
    </section>
  );
};

export default Faq;
