const KitCard = ({ title, items }) => {
  return (
    <div className="bg-white rounded-md p-6 shadow-[0_25px_45px_rgba(0,0,0,0.08)] hover:shadow-none transition">
      <h3 className="text-lg font-medium text-center underline mb-6">
        {title}
      </h3>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-4 border border-black/12.5 rounded-sm p-4"
          >
            <img
              src={item.image}
              alt="product"
              className="w-20 h-20 rounded-full object-cover"
            />

            <div className="grow">
              <h4 className="font-semibold text-sm uppercase text-[#444] text-center py-3.5">
                {item.heading}
              </h4>
              <p className="text-sm text-gray-600 mt-1 text-center font-thin tracking-wide">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function PersonalizedKitSection() {
  return (
    <section className="py-20 bg-white">
      <div className="app-container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-5">
          {/* LEFT CARD */}
          <KitCard
            title="Nutriient Personalized Kit for Subhajit"
            items={[
              {
                heading: "Nutriient Essential Vitamins and Minerals",
                desc: "Because Subhajit having high protein diet so he needs to manage his micro nutrients.",
                image: "/showcase-products/essential-vitamins.jpg",
              },
              {
                heading: "Nutriient Personalized 2600 Kcal Diet Plan",
                desc: "He is doing workout and building muscle so having high protein personalized diet.",
                image: "/showcase-products/2600-kcal.jpg",
              },
              {
                heading: "Nutriient Omega 3 Fish Oil",
                desc: "Because he needs to have a healthy heart and manage cholesterol.",
                image: "/showcase-products/oil.jpg",
              },
            ]}
          />

          {/* RIGHT CARD */}
          <KitCard
            title="Nutriient Personalized Kit for Soumya"
            items={[
              {
                heading: "Nutriient Calcium with Vitamin D3",
                desc: "Because Soumya has prior bone issues and stiffness in joints.",
                image: "/showcase-products/calcium.jpg",
              },
              {
                heading: "Nutriient Spirulina, Magnesium and Ashwagandha",
                desc: "He needs mental health boost and manage antioxidants in his body.",
                image: "/showcase-products/spirulina.jpg",
              },
              {
                heading: "Nutriient Personalized 2300 Kcal Diet Plan",
                desc: "He is loosing fat so he is having fat loss personalized diet.",
                image: "/showcase-products/2300-kcal.jpg",
              },
            ]}
          />
        </div>
      </div>
    </section>
  );
}
