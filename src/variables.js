export const BASE_URL = "http://localhost:4000/api";

// ====================== List of Health Supplements ======================
export const healthSupplements = [
  { name: "Calcium", path: "calcium" },
  { name: "Omega 3", path: "omega-3" },
];

// ====================== List of Health Pre Packs ======================
export const healthPrePacks = [
  { name: "Skin Care", path: "skin-care" },
  { name: "Gut Health", path: "gut-health" },
  { name: "Hair Care", path: "hair-care" },
];

// ================ How we work steps ==================
export const steps = [
  {
    image_path: "/icons/work-img-1.webp",
    text: `Tell Us About Your Health Concerns And Goals In Details. We'll Be Glad To Hear From You.`,
  },
  {
    image_path: "/icons/work-img-2.webp",
    text: `We Personalize Your Diet Plans And Dietary Supplements Which Is Easily Sustainable.`,
  },
  {
    image_path: "/icons/work-img-3.webp",
    text: `Get Started With Your Healthy Routine And Our Nutritionists Will Help You Along The Way.`,
  },
  {
    image_path: "/icons/work-img-4.webp",
    text: `Tracking Your Health, Makes Our Job Easy To Adjust As Per Your Health Requirements.`,
  },
];

// ================ Routin Slider Slides ==================
export const slides = [
  {
    name: "Rohit's Plan",
    role: "Software Engineer",
    desc: "Rohit was looking to improve joints stiffness, bones health and loose fat slowly in a healthy way.",
    points: [
      {
        icon_class: "fa-solid fa-road",
        data: "Calcium and Vitamin D for healthy bones",
      },
      {
        icon_class: "fa-solid fa-virus-covid-slash",
        data: "Essential Fatty Acids for healthy joints and heart",
      },
      {
        icon_class: "fa-solid fa-headset",
        data: "Sustainable 2200 kcal Diet Plan to help in healthy weight loss and balance nutrition",
      },
    ],
    image: "/slide-img-1.jpg",
  },
  {
    name: "Ananya's Plan",
    role: "Student",
    desc: "Ananya was looking to improve her acne scar issues, gut health and maintain body weight.",
    points: [
      {
        icon_class: "fa-solid fa-road",
        data: "Collagen and Vitamin C to cure acne scars*",
      },
      {
        icon_class: "fa-solid fa-virus-covid-slash",
        data: "Probiotics to take care of digestion*",
      },
      {
        icon_class: "fa-solid fa-headset",
        data: "Sustainable 1900 kcal Diet Plan to maintain body weight and balance nutrition",
      },
    ],
    image: "/slide-img-2.jpg",
  },
];

// ================ FAQ Slides ==================
export const faqs = [
  {
    question: "How can you help me with the diet and nutrition?",
    answer:
      "We will provide you with your health analysis after you take our survey. According to your health analysis, we recommend supplements and diet plans to help you reach your health concerns without medicines or external care. Our nutritionists will guide you throughout your journey.",
  },
  {
    question: "How are you different from other supplements brand?",
    answer:
      "We provide personalized nutrition based on your health needs, backed by science, and free from harmful additives.",
  },
  {
    question: "How do I connect with nutritionists?",
    answer:
      "Once you onboard with us, our certified nutritionists will be available to assist you through consultations.",
  },
  {
    question: "How much time it takes to deliver to my home?",
    answer:
      "Delivery usually takes 5–7 working days depending on your location.",
  },
  {
    question: "How I will receive the supplements and diet plans?",
    answer:
      "Supplements are delivered to your home, and diet plans are shared digitally for easy access.",
  },
  {
    question: "How does your system work?",
    answer:
      "Our system analyzes your inputs, prepares a personalized routine, and supports you throughout your health journey.",
  },
];

// ================ Personalized Plans ==================

export const personalizedPlans = [
  {
    text: "Home-friendly Indian diet based on your calories, routine & preferences",
    image: "/recomended/check-icon.svg",
  },
  {
    text: "Simple portion guide with clear meal swaps and weekly cheat meal",
    image: "/recomended/check-icon.svg",
  },
  {
    text: "Daily protein & balanced carbs to control cravings and boost metabolism",
    image: "/recomended/check-icon.svg",
  },
  {
    text: "15–25 min home workout plan (beginner–advanced)",
    image: "/recomended/check-icon.svg",
  },
  {
    text: "Weekly check-ins for weight, bloating, digestion & energy",
    image: "/recomended/check-icon.svg",
  },
  {
    text: "Weekly plan adjustments based on your progress",
    image: "/recomended/check-icon.svg",
  },
  {
    text: "Full guidance to build long-term healthy habits",
    image: "/recomended/check-icon.svg",
  },
];

// ================ Balanced Recommendation ==================

export const balancedRecommendations = [
  {
    text: "Recommended for at least 3-6 months to fully reset root causes for long-term results.",
    image: "/recomended/check-icon.svg",
  },
  {
    text: "Visible results typically begin within 2–4 weeks with your personalized diet + workouts.",
    image: "/recomended/check-icon.svg",
  },
  {
    text: "All Nutrient dietary supplements are clean and lab-tested.",
    image: "/recomended/check-icon.svg",
  },
  {
    text: "After 6 months, most users maintain progress with just diet + monitoring.",
    image: "/recomended/check-icon.svg",
  },
  {
    text: "You stay consistent because we handle your diet, workouts, and weekly accountability.",
    image: "/recomended/check-icon.svg",
  },
];

// ================ Testimonial Slides ==================

export const testimonialSlides = [
  {
    userName: "Achintya",
    place: "Kolkata",
    noOfStars: 5,
    title: "They are very professional",
    desc: "I have been using nutrient for last 5 months now, all I can say is they are very professional with consultations and so far I have seen very good results with some effort from my side. My routine was updated 3 times in 5 months now and with each routine my energy and hair felt a lot better.",
    image: "/recomended/user-1.svg",
  },
  {
    userName: "Ajeet",
    place: "New Delhi",
    noOfStars: 5,
    title: "I happy with Nutrient",
    desc: "2 months back I saw Nutrient's ad in my facebook feed while scrolling, then after that I have seen so many ads from them. At that time I was suffering from hair loss and used a lot of products so though about giving it a try.",
    image: "/recomended/user-2.svg",
  },
  {
    userName: "Dilip",
    place: "Dhanbad",
    noOfStars: 5,
    title: "They are very professional",
    desc: "I'm not someone who eats well and eats clean as an office going employee I don't have much time for dieting. My daughter saw an ad and told me to opt for Nutrient Diet plans for my cholesterol problems.",
    image: "/recomended/user-3.svg",
  },
];
