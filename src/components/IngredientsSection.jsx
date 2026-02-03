export default function IngredientsSection() {
  return (
    <section
      className="relative bg-[url('/bg/ingredientsbg.jpg')] bg-cover bg-top-left overflow-hidden shadow-[0_24px_35px_11px_rgb(153_153_153_/_84%)]
"
    >
      <div className="relative app-container mx-auto px-4 py-24">
        <div className="grid lg:grid-cols-[40%_60%] items-center">
          {/* LEFT IMAGE */}
          <div className="relative mx-auto lg:mx-0">
            <img
              src="/ingredients.png"
              alt="Ingredients"
              className="w-full object-cover"
            />
          </div>

          {/* RIGHT CONTENT */}
          <div className="text-gray-800 lg:pl-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ingredients We Use
            </h2>

            <div className="space-y-5 text-sm md:text-base leading-relaxed">
              <p>
                We use 100% natural ingredients for our health supplements that
                are safe for day to day usage and backed by science and
                transparent about the whole process.
              </p>

              <p>
                All our supplements are free from heavy metals, gluten, dairy,
                soy and artificial substances, so you can be sure about what you
                are putting in.
              </p>

              <p>
                For diets, we suggest ingredients that are readily available in
                Indian households to make meals that are easily sustainable
                without extra cost and effort.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* wave divider */}
      <div className="w-full h-16 absolute bottom-0 left-0 flex items-end">
        <svg
          viewBox="0 0 1440 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="translate-y-2"
        >
          <path
            d="M0 43.9999C106.667 43.9999 213.333 7.99994 320 7.99994C426.667 7.99994 533.333 43.9999 640 43.9999C746.667 43.9999 853.333 7.99994 960 7.99994C1066.67 7.99994 1173.33 43.9999 1280 43.9999C1386.67 43.9999 1440 19.0266 1440 9.01329V100H0V43.9999Z"
            className="fill-current text-white"
          ></path>
        </svg>
      </div>
    </section>
  );
}
