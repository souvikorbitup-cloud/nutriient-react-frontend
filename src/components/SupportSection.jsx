import Button from "./Button";

export default function SupportSection() {
  return (
    <section className="bg-[linear-gradient(180deg,_#e9fda9,_#a1dc5e)] py-16 shadow-[0_24px_35px_11px_rgba(153,153,153,0.15)]
">
      <div className="app-container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* LEFT CONTENT */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              We are with you all the way
            </h2>

            <p className="text-gray-800 mb-5 leading-relaxed">
              It's not easy to take the first step and we congratulate you for
              making the decision to step up your healthy routine. Now you just
              need to stick with the routine and we promise you can do it.
            </p>

            <p className="text-gray-800 mb-5 leading-relaxed">
              Once you onboard with us we will guide you all the way and for
              this specific reason, we are here to make your health journey
              easier.
            </p>

            <p className="text-gray-800 mb-8 leading-relaxed">
              It's never been late to start a good regimen for the betterment of
              your health. We are happy to start that healthy regimen with you.
            </p>

            <div className="flex justify-center">
              <Button text="TAKE QUIZ NOW" />
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="flex justify-center lg:justify-end order-1 lg:order-2">
            <img
              src="/nutriient-we-are-with-you.gif"
              alt="Consultancy from Nutritionist"
              className="max-w-96 lg:max-w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
