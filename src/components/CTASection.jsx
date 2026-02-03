import Button from "./Button";

export default function CTASection({ btnText }) {
  return (
    <section className=" py-8">
      <div
        className="
          relative app-container mx-auto px-4
        "
      >
        <div
          className="rounded-3xl
          bg-[url('/bg/quiz_bg.webp')]
          bg-cover bg-center
          overflow-hidden"
        >
          {/* Content */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center md:px-6 py-10">
            <h2 className="text-xl md:text-4xl font-bold text-gray-800 mb-6">
              Ready To Get Started With Us?
            </h2>

            <Button text={btnText} />
          </div>
        </div>
      </div>
    </section>
  );
}
