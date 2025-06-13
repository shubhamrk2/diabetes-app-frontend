"use client";

const recipes = [
  {
    title: "Grilled chicken with quinoa salad",
    image: "/images/GrilledChicken.jpeg",
    calories: "350 kcal per serving",
  },
  {
    title: "Avocado toast with boiled eggs",
    image: "/images/Avocado toast with boiled eggs.jpg",
    calories: "280 kcal per serving",
  },
  {
    title: "Oats and mixed berry smoothie",
    image: "/images/Oats and mixed berry smoothie.jpg",
    calories: "220 kcal per serving",
  },
  {
    title: "Low-carb zucchini pasta dish",
    image: "/images/Low-carb zucchini pasta dish.jpg",
    calories: "190 kcal per serving",
  },
  {
    title: "Stir-fried tofu and veggies bowl",
    image: "\images/stir-fried tofu and veggies bowl.jpg",
    calories: "300 kcal per serving",
  },
  {
    title: "Baked salmon with steamed greens",
    image: "/images/Baked salmon with steamed greens.jpg",
    calories: "330 kcal per serving",
  },
];

export default function RecipeSlider() {
  return (
    <div className="px-6 py-10 bg-gray-100">
      <h2 className="text-2xl font-semibold mb-6">Explore Healthy Recipes</h2>
      <div className="flex overflow-x-auto snap-x snap-mandatory space-x-6 scrollbar-hide">
        {recipes.map((item, index) => (
          <div
            key={index}
            className="relative snap-start w-64 min-w-[16rem] h-80 bg-white rounded-lg overflow-hidden shadow-md transition-transform duration-300 transform hover:scale-105 group"
          >
            {/* Default View */}
            <div className="absolute inset-0 group-hover:hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-medium">{item.title}</h3>
                <a href="#" className="text-blue-600 mt-2 inline-block">
                  View Recipe &gt;
                </a>
              </div>
            </div>

            {/* Hover View */}
            <div className="absolute inset-0 hidden group-hover:flex flex-col justify-center items-center bg-gray-800 text-white text-center px-4">
              <p className="text-xl font-bold">Calories Info</p>
              <p className="text-sm mt-2">{item.calories}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
